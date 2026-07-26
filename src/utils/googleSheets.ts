export interface AuditSheetRow {
  timestamp: string;
  organization: string;
  email: string;
  scopeBudget: string;
  requirements: string;
  status: string;
}

export interface GoogleSpreadsheetInfo {
  spreadsheetId: string;
  title: string;
  spreadsheetUrl: string;
}

/**
 * Creates a new Google Spreadsheet for Cyber Audit Briefs
 */
export async function createAuditSpreadsheet(
  accessToken: string,
  customTitle = 'Cyber Ops - Security Audit Log'
): Promise<GoogleSpreadsheetInfo> {
  const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      properties: {
        title: customTitle
      },
      sheets: [
        {
          properties: {
            title: 'Audit Briefs',
            gridProperties: {
              frozenRowCount: 1
            }
          },
          data: [
            {
              startRow: 0,
              startColumn: 0,
              rowData: [
                {
                  values: [
                    { userEnteredValue: { stringValue: 'Timestamp (UTC)' } },
                    { userEnteredValue: { stringValue: 'Organization' } },
                    { userEnteredValue: { stringValue: 'Confidential Email' } },
                    { userEnteredValue: { stringValue: 'Engagement Scope & Budget' } },
                    { userEnteredValue: { stringValue: 'Security Audit Requirements' } },
                    { userEnteredValue: { stringValue: 'Triage Status' } }
                  ]
                }
              ]
            }
          ]
        }
      ]
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to create Google Sheet: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    spreadsheetId: data.spreadsheetId,
    title: data.properties.title,
    spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${data.spreadsheetId}/edit`
  };
}

/**
 * Appends an audit brief row to a Google Sheet
 */
export async function appendAuditRowToSheet(
  accessToken: string,
  spreadsheetId: string,
  row: AuditSheetRow
): Promise<void> {
  const range = 'Audit Briefs!A:F';
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      values: [
        [
          row.timestamp,
          row.organization,
          row.email,
          row.scopeBudget,
          row.requirements,
          row.status
        ]
      ]
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to append row to Google Sheet: ${response.statusText}`);
  }
}

/**
 * Fetches all rows from the audit sheet
 */
export async function fetchAuditRowsFromSheet(
  accessToken: string,
  spreadsheetId: string
): Promise<string[][]> {
  const range = 'Audit Briefs!A1:F100';
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to fetch sheet rows: ${response.statusText}`);
  }

  const data = await response.json();
  return data.values || [];
}
