const NOTIFICATION_EMAIL = 'nateugc5@gmail.com';
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
      data.name || '', data.phone || '', data.zip || '',
      data.state || '', data.state_code || '',
      data.scenario || '', data.scenario_answer || '',
      data.second_scenario || '', data.confidence || '',
      data.utm_source || 'direct', data.utm_medium || 'none',
      data.utm_campaign || 'none', data.utm_content || 'none',
      data.utm_term || 'none', data.ab_variant || '',
      data.time_to_submit || '', data.funnel_version || '', 'New'
    ];
    sheet.appendRow(row);
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1, 1, HEADERS.length).setBackground('#EFF9F0');
    sendNotification(data, lastRow);
    return buildResponse({success: true, row: lastRow});
  } catch(err) {
    return buildResponse({success: false, error: err.message});
  }
}

function buildResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return buildResponse({status:'ok', service:'Am I Covered Lead Backend', version:'2.1'});
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
    sheet.setColumnWidth(1,160); sheet.setColumnWidth(2,130); sheet.setColumnWidth(3,130);
    sheet.setColumnWidth(4,80);  sheet.setColumnWidth(5,100); sheet.setColumnWidth(10,160);
    sheet.setColumnWidth(19,100);
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
  const subject = '🔔 New Lead — ' + data.name + ' (' + (data.state||data.zip) + ')';
  const confEmoji = {'Yes - feel well covered':'✅','Not sure what I have':'🤔','Probably not - I have gaps':'🚨'};
  const ci = confEmoji[data.confidence] || '❓';
  const html = '<div style="font-family:-apple-system,sans-serif;max-width:480px"><div style="background:#E84010;padding:16px 20px;border-radius:8px 8px 0 0"><h2 style="color:#fff;margin:0">🔔 New Lead — Am I Covered</h2></div><div style="background:#fff;border:1px solid #E0D9CF;border-top:none;padding:20px;border-radius:0 0 8px 8px"><table style="width:100%;border-collapse:collapse;font-size:14px"><tr style="border-bottom:1px solid #eee"><td style="padding:8px 0;color:#888;width:40%">Name</td><td style="padding:8px 0;font-weight:600">' + data.name + '</td></tr><tr style="border-bottom:1px solid #eee"><td style="padding:8px 0;color:#888">Phone</td><td style="padding:8px 0"><a href="tel:' + data.phone + '" style="color:#E84010;font-weight:600;text-decoration:none">' + data.phone + '</a></td></tr><tr style="border-bottom:1px solid #eee"><td style="padding:8px 0;color:#888">Location</td><td style="padding:8px 0">' + data.zip + ' · ' + data.state + '</td></tr><tr style="border-bottom:1px solid #eee"><td style="padding:8px 0;color:#888">Scenario</td><td style="padding:8px 0">' + data.scenario + '</td></tr><tr style="border-bottom:1px solid #eee"><td style="padding:8px 0;color:#888">Confidence</td><td style="padding:8px 0">' + ci + ' ' + data.confidence + '</td></tr><tr><td style="padding:8px 0;color:#888">Source</td><td style="padding:8px 0">' + data.utm_source + ' / ' + data.utm_campaign + '</td></tr></table><div style="background:#FFF8F5;border:1px solid #F0DDD5;border-radius:6px;padding:12px;margin-top:16px;text-align:center"><strong style="color:#E84010">📞 Call within 5 minutes — row ' + rowNum + '</strong></div></div></div>';
  const plain = 'New Lead\nName: '+data.name+'\nPhone: '+data.phone+'\nZip: '+data.zip+' ('+data.state+')\nScenario: '+data.scenario+'\nConfidence: '+ci+' '+data.confidence+'\nSource: '+data.utm_source+'/'+data.utm_campaign+'\nRow: '+rowNum+'\n\nCALL WITHIN 5 MINUTES.';
  GmailApp.sendEmail(NOTIFICATION_EMAIL, subject, plain, {htmlBody: html});
}
