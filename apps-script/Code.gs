const SHEET_NAME = "Orders";

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const data = JSON.parse(e.postData.contents);
    
    // Generate Order ID
    const lastRow = sheet.getLastRow();
    const orderId = lastRow === 0 ? "ORD-1000" : "ORD-" + (1000 + lastRow);
    
    // Columns according to your exact requirement
    const rowData = [
      orderId,                  // A: Order ID
      data.date,                // B: Date
      data.time,                // C: Time
      data.name,                // D: Customer Name
      "'" + data.phone,         // E: Phone (force string to keep 0)
      data.district,            // F: District
      data.area,                // G: Area
      data.address,             // H: Address
      data.note,                // I: Note
      data.totalQty,            // J: Total Quantity
      data.subtotal,            // K: Subtotal
      data.deliveryCharge,      // L: Delivery Charge
      data.grandTotal,          // M: Grand Total
      "Cash on Delivery",       // N: Payment
      "Pending",                // O: Status
      data.orderSummary,        // P: Order Summary (Formatted)
      data.url                  // Q: URL/UTM Ref
    ];
    
    sheet.appendRow(rowData);
    
    return ContentService.createTextOutput(JSON.stringify({"status": "success"}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({"status": "error", "message": error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
