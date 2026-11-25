import { workflow, node, trigger, ifElse, expr } from '@n8n/workflow-sdk';

// סגל אוטומציות · פניות מהאתר
// הטופס באתר שולח לכאן שם, טלפון ומשפט על העסק. התהליך בודק, שומר בטבלה ושולח מייל לאריה.
// שדה מלכודת (website): דפדפן אמיתי משאיר אותו ריק. בוט שממלא אותו מקבל 200 ולא נוצרת הרצה.
const intake = trigger({
  type: 'n8n-nodes-base.webhook',
  version: 2.2,
  config: {
    name: 'פנייה מהאתר',
    parameters: {
      httpMethod: 'POST',
      path: 'segal-lead',
      authentication: 'none',
      responseMode: 'responseNode',
      options: {
        allowedOrigins: 'https://segalautomations.cloud,https://www.segalautomations.cloud',
        ignoreBots: true,
        onlyRunIf: '{{ !($json.body && $json.body.website) }}'
      }
    }
  }
});

const check = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'בדיקת הפרטים',
    parameters: {
      mode: 'runOnceForEachItem',
      language: 'javaScript',
      jsCode:
        "const b = $json.body || {};\n" +
        "const clean = (v, n) => String(v ?? '').replace(/[<>]/g, '').replace(/\\s+/g, ' ').trim().slice(0, n);\n" +
        "const name = clean(b.name, 60);\n" +
        "const digits = String(b.phone ?? '').replace(/\\D/g, '');\n" +
        "const message = clean(b.message, 1000);\n" +
        "const source = clean(b.source || 'אתר', 80);\n" +
        "let error = '';\n" +
        "if (name.length < 2) error = 'נא למלא שם.';\n" +
        "else if (!/^0\\d{8,9}$/.test(digits)) error = 'נא לבדוק את מספר הטלפון.';\n" +
        "const phone = digits.length === 10 ? digits.slice(0, 3) + '-' + digits.slice(3) : digits.slice(0, 2) + '-' + digits.slice(2);\n" +
        "return { json: { valid: !error, error, name, phone, message, source } };\n"
    }
  }
});

const isValid = ifElse({
  version: 2.2,
  config: {
    name: 'הפרטים תקינים?',
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'strict' },
        conditions: [{ leftValue: expr('{{ $json.valid }}'), operator: { type: 'boolean', operation: 'true', singleValue: true } }],
        combinator: 'and'
      }
    }
  }
});

const save = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'שמירת הפנייה',
    parameters: {
      resource: 'row',
      operation: 'insert',
      dataTableId: { __rl: true, mode: 'id', value: 'zH8bLNTgZ5xaICiN', cachedResultName: 'סגל אוטומציות · פניות מהאתר' },
      columns: {
        mappingMode: 'defineBelow',
        value: {
          name: expr('{{ $json.name }}'),
          phone: expr('{{ $json.phone }}'),
          message: expr('{{ $json.message }}'),
          source: expr('{{ $json.source }}'),
          status: 'חדשה'
        },
        schema: [
          { id: 'name', displayName: 'name', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true },
          { id: 'phone', displayName: 'phone', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true },
          { id: 'message', displayName: 'message', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true },
          { id: 'source', displayName: 'source', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true },
          { id: 'status', displayName: 'status', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true }
        ]
      }
    }
  }
});

const notify = node({
  type: 'n8n-nodes-base.emailSend',
  version: 2.1,
  config: {
    name: 'מייל לאריה',
    parameters: {
      fromEmail: 'אתר סגל אוטומציות <as7178299@gmail.com>',
      toEmail: 'segalautomations@gmail.com',
      subject: expr("פנייה חדשה מהאתר: {{ $('בדיקת הפרטים').item.json.name }}"),
      html: expr("<div dir=\"rtl\" style=\"font-family:Arial,sans-serif;text-align:right;line-height:1.7;font-size:16px\"><h2 style=\"margin:0 0 10px;color:#16202E\">פנייה חדשה מהאתר</h2><p style=\"margin:0\"><b>שם:</b> {{ $('בדיקת הפרטים').item.json.name }}<br><b>טלפון:</b> <a href=\"tel:{{ $('בדיקת הפרטים').item.json.phone }}\">{{ $('בדיקת הפרטים').item.json.phone }}</a><br><b>על העסק:</b> {{ $('בדיקת הפרטים').item.json.message || '(לא מולא)' }}<br><b>מאיפה:</b> {{ $('בדיקת הפרטים').item.json.source }}<br><b>מתי:</b> {{ $now.setZone('Asia/Jerusalem').toFormat('dd.MM.yyyy HH:mm') }}</p><p style=\"margin:16px 0 0\"><a href=\"https://wa.me/972{{ $('בדיקת הפרטים').item.json.phone.replace(/\\D/g,'').slice(1) }}\" style=\"background:#16202E;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none\">פתיחת שיחה בוואטסאפ</a> &nbsp; <a href=\"https://airtable.com/appwxliAt44KetGbp/pag0GIgRtCqNs8Ftv\" style=\"color:#16202E\">ללוח הלידים</a></p></div>"),
      options: { appendAttribution: false }
    },
    credentials: { smtp: { id: 'RNL2Y8Kjk3EVewj8', name: 'SMTP account' } }
  }
});

const ok = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: {
    name: 'תשובה: התקבל',
    parameters: { respondWith: 'json', responseBody: '{ "ok": true }', options: { responseCode: 200 } }
  }
});

const bad = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: {
    name: 'תשובה: פרטים חסרים',
    parameters: { respondWith: 'json', responseBody: expr('{{ JSON.stringify({ ok: false, message: $json.error }) }}'), options: { responseCode: 400 } }
  }
});

export default workflow('segal-leads', 'סגל אוטומציות · פניות מהאתר')
  .add(intake)
  .to(check)
  .to(isValid.onTrue(save.to(notify.to(ok))).onFalse(bad));
