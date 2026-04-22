/**
 * AM I COVERED — Lead Capture Backend
 * Google Apps Script (Google Sheets + Gmail)
 *
 * SETUP (one-time, ~3 minutes):
 * 1. Go to script.google.com → New project
 * 2. Paste this entire file, replacing the default code
 * 3. Update NOTIFICATION_EMAIL below to your email address
 * 4. Click Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Click Deploy → copy the Web App URL
 * 6. Paste that URL into index.html → CONFIG.LEAD_ENDPOINT
 */

const NOTIFICATION_EMAIL = 'YOUR_EMAIL@gmail.com'; // <-- change this
const SHEET_NAME         = 'Am I Covered Leads';
const SPREADSHEET_NAME   = 'Am I Covered — Lead Database';

const HEADERS = [
  'Timestamp','Name','Phone','Zip','State','State Code',
  'Scenario','Their Answer','Second Scenario','Confidence',
  'UTM Source','UTM Medium','UTM Campaign','UTM Content','UTM Term',
  'A/B Variant','Time to Submit','Funnel Version','Status'
];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet();
    const row = [
      new Date().toLocaleString('en-US', {timeZone:'America/Chicago'}),
      data.name          || '',
      data.phone         || '',
      data.zip           || '',
      data.state         || '',
      data.state_code    || '',
      data.scenario      || '',
      data.scenario_answer || '',
      data.second_scenario || '',
      data.confidence    || '',
      data.utm_source    || 'direct',
      data.utm_medium    || 'none',
      data.utm_campaign  || 'none',
      data.utm_content   || 'none',
      data.utm_term      || 'none',
      data.ab_variant    || '',
      data.time_to_submit || '',
      data.funnel_version || '',
      'New'
    ];
    sheet.appendRow(row);
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1, 1, HEADERS.length).setBackground('#EFF9F0');
    sendNotification(data, lastRow);
    return ContentService
      .createTextOutput(JSON.stringify({success: true, row: lastRow}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: err.message}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSheet() {
  let ss;
  const files = DriveApp.getFilesByName(SPREADSHEET_NAME);
  if (files.hasNext()) {
    ss = SpreadsheetApp.open(files.next());
  } else {
    ss = SpreadsheetApp.create(SPREADSHEET_NAME);
    const sheet = ss.getActiveSheet();
    sheet.setName(SHEET_NAME);
    sheet.appendRow(HEADERS);
    const hr = sheet.getRange(1, 1, 1, HEADERS.length);
    hr.setBackground('#1A1A1A').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(11);
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1,160);sheet.setColumnWidth(2,130);sheet.setColumnWidth(3,130);
    sheet.setColumnWidth(4,80);sheet.setColumnWidth(5,100);sheet.setColumnWidth(10,160);sheet.setColumnWidth(19,100);
    return sheet;
  }
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.getRange(1,1,1,HEADERS.length).setBackground('#1A1A1A').setFontColor('#FFFFFF').setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function sendNotification(data, rowNum) {
  const subject = '🔔 New Lead — ' + data.name + ' (' + (data.state || data.zip) + ')';
  const confEmoji = {'Yes - feel well covered':'✅','Not sure what I have':'🤔','Probably not - I have gaps':'🚨'};
  const confIcon = confEmoji[data.confidence] || '❓';
  const body = 'NEW LEAD\nName: ' + data.name + '\nPhone: ' + data.phone + '\nZip: ' + data.zip + ' (' + data.state + ')\nScenario: ' + data.scenario + '\nConfidence: ' + confIcon + ' ' + data.confidence + '\nSource: ' + data.utm_source + ' / ' + data.utm_campaign + '\nA/B: ' + data.ab_variant + '\nTime: ' + data.time_to_submit + '\nRow: ' + rowNum + '\n\nCALL WITHIN 5 MINUTES.';
  const htmlBody = '<div style="font-family:-apple-system,sans-serif;max-width:480px"><div style="background:#E84010;padding:16px 20px;border-radius:8px 8px 0 0"><h2 style="color:#fff;margin:0;font-size:18px">🔔 New Lead</h2></div><div style="background:#fff;border:1px solid #E0D9CF;border-top:none;padding:20px;border-radius:0 0 8px 8px"><table style="width:100%;border-collapse:collapse;font-size:14px"><tr style="border-bottom:1px solid #F0E8E0"><td style="padding:8px 0;color:#888;width:40%">Name</td><td style="padding:8px 0;font-weight:600">' + data.name + '</td></tr><tr style="border-bottom:1px solid #F0E8E0"><td style="padding:8px 0;color:#888">Phone</td><td style="padding:8px 0;font-weight:600;color:#E84010"><a href="tel:' + data.phone + '" style="color:#E84010;text-decoration:none">' + data.phone + '</a></td></tr><tr style="border-bottom:1px solid #F0E8E0"><td style="padding:8px 0;color:#888">Location</td><td style="padding:8px 0">' + data.zip + ' · ' + data.state + '</td></tr><tr style="border-bottom:1px solid #F0E8E0"><td style="padding:8px 0;color:#888">Scenario</td><td style="padding:8px 0">' + data.scenario + '</td></tr><tr style="border-bottom:1px solid #F0E8E0"><td style="padding:8px 0;color:#888">Confidence</td><td style="padding:8px 0">' + confIcon + ' ' + data.confidence + '</td></tr><tr><td style="padding:8px 0;color:#888">Source</td><td style="padding:8px 0">' + data.utm_source + ' / ' + data.utm_campaign + '</td></tr></table><div style="background:#FFF8F5;border:1px solid #F0DDD5;border-radius:6px;padding:12px;margin-top:16px;text-align:center"><strong style="color:#E84010;font-size:13px">📞 Call within 5 minutes for best close rate</strong></div></div></div>';
  GmailApp.sendEmail(NOTIFICATION_EMAIL, subject, body, {htmlBody});
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({status:'ok',service:'Am I Covered Lead Backend',version:'2.0',timestamp:new Date().toISOString()}))
    .setMimeType(ContentService.MimeType.JSON);
}
