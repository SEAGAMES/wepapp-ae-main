import pdfMake from "pdfmake";
import pdfFonts from "../assets/Font/Sarabun/Sarabun-fonts";
import axios from "axios";
import { apiConvertImg } from "../services/constants";
import JsBarcode from "jsbarcode/bin/JsBarcode";
import moment from "moment";
import store from "../store/index";
// import { invoiceTemplat } from "../services/invoice"

const uploadImgEmp = async (img) => {
  const res = await axios.post(
    `http://192.168.3.5:3000/insert_ImgEmployee`,
    img
  );
  // console.log('res : ', res)
  return res;
};

const testUploadImg = async (img) => {
  const res = await axios.post(`http://192.168.3.5:3000/test-insertImg`, img);
  return res;
};

const testNewprint = async (dataArr) => {
  await axios.post("http://192.168.3.5:3000/pdf-mpp", dataArr);
  // console.log(result);
};

const testInsertImg = async (data) => {
  const Img = {
    imageBase64: data,
  };
  const result = await axios.post(
    "http://192.168.3.5:3000/test-insertImg",
    Img
  );
  return result.data;
};

const printRepairDoc = async (dataBill) => {
  try {
    const logoHeader = await convertImg(
      "http://192.168.3.5:3000/picture/PICTURE2/Art%20Event%20Logo2.jpg"
    );
    const checkbox = await convertImg(
      "http://192.168.3.5:3000/picture/PICTURE2/WEB_AE/MPP/MPPStatus/checkbox.png"
    );
    const docDefinition = {
      content: [
        //Header Logo และ JobNumber
        {
          columns: [
            {
              image: logoHeader,
              width: 150,
              alignment: "center",
            },

            { text: "", width: 230 },

            {
              table: {
                body: [
                  [
                    { text: "Job : ", alignment: "center" },
                    {
                      text: ` ${dataBill.BillDoc} `,
                      alignment: "center",
                    },
                  ],

                  [
                    {
                      text: `วันที่แจ้ง : ${moment(dataBill.JobDate).format(
                        "L"
                      )} `,
                      colSpan: 2,
                      alignment: "center",
                      fontSize: 11,
                    },
                  ],
                ],
              },
              alignment: "center",
            },
          ],
        },
        //Header หัวเรื่องแจ้งซ่อม
        {
          text: "ใบแจ้งซ่อม",
          style: "header",
          margin: [0, 20],
        },
        {
          text: [
            { text: `ข้าพเจ้า ` },
            {
              text: ` ${dataBill.ContactPersonName} `,
              fontSize: 14,
              bold: true,
            },
            ` รหัสพนักงาน :  `,
            {
              text: `${dataBill.ContactPerson} `,
              fontSize: 14,
              bold: true,
            },
            ` ขอแจ้งซ่อมแผนก : `,
            {
              text: `${dataBill.JobTypeName}`,
              fontSize: 14,
              bold: true,
            },
          ],
          style: "marginLeft",
        },
        {
          text: [
            { text: "ประเภทที่แจ้ง", fontSize: 12 },
            {
              text: ` ${dataBill.CategoryName} `,
              fontSize: 14,
              bold: true,
            },
            { text: "โดยมีรายละเอียดดังนี้", fontSize: 12 },
          ],
          // style: "text",
        },
        {
          columns: [
            {
              width: "*",
              table: {
                body: [
                  [
                    {
                      text: "หัวข้อ : ",
                      alignment: "left",
                      styles: "text",
                      bold: true,
                    },
                    { text: "แจ้งซ่อม", alignment: "center" },
                  ],
                  [
                    {
                      text: "ประเภท : ",
                      styles: "text",
                      bold: true,
                    },
                    {
                      text: `${dataBill.CategoryName} `,
                      alignment: "center",
                    },
                  ],
                  [
                    {
                      text: `${
                        dataBill.RepairBillNo !== ""
                          ? "เลขบิลเเจ้งเเก้"
                          : "หมายเลขเครื่อง"
                      }`,
                      styles: "text",
                      bold: true,
                    },
                    {
                      text: `${
                        dataBill.RepairBillNo.trim() === ""
                          ? dataBill.DeviceNo
                          : dataBill.RepairBillNo
                      } `,
                      alignment: "center",
                    },
                  ],
                  [
                    {
                      text: "ชั้นที่ : ",
                      styles: "text",
                      bold: true,
                    },
                    {
                      text: `${dataBill.FloorName} `,
                      alignment: "center",
                    },
                  ],
                  [
                    {
                      text: "ห้อง : ",
                      styles: "text",
                      bold: true,
                    },
                    {
                      text: `${dataBill.RoomName} `,
                      alignment: "center",
                    },
                  ],
                ],
              },
            },
            {
              width: 90,
              text: "",
            },
            {
              width: "*",
              table: {
                body: [
                  [
                    {
                      text: "แจ้งแผนก : ",
                      alignment: "left",
                      styles: "text",
                      bold: true,
                    },
                    {
                      text: `${dataBill.JobTypeName} `,
                      alignment: "center",
                    },
                  ],
                  [
                    {
                      text: "วันที่ต้องการให้เสร็จ : ",
                      alignment: "left",
                      styles: "text",
                      bold: true,
                    },
                    {
                      text: `${moment(dataBill.DueDate).format("LL")}`,
                      alignment: "center",
                    },
                  ],
                ],
              },
            },
          ],
          margin: [0, 10, 0, 0],
        },
        {
          text: "รายละเอียดอาการเสีย : ",
          style: "title",
        },
        // รายละเอียด
        {
          text: `${dataBill.BrokenDes}`,
          margin: [20, 10, 0, 0],
        },

        {
          text: "รายละเอียดการแก้ไขปัญหา : ",
          style: "title",
        },
        // รายละเอียด
        {
          text: `${dataBill.RepairDes}`,
          margin: [20, 10, 0, 0],
        },
        " ",
        " ",
        {
          columns: [
            {
              image: checkbox,
              width: 12,
              style: "icon",
            },
            { text: "", width: 10 },
            {
              text: "ซ่อมไม่ได้ ต้องเบิกซื้อใหม่",
              margin: [0, -3, 0, 0],
            },
          ],
        },
        {
          columns: [
            {
              text:
                "..........................................................",
              style: "textAlign",
            },
            { text: "", width: 110 },
            {
              text:
                "..........................................................",
              style: "textAlign",
            },
          ],
          margin: [0, 50, 0, 0],
        },
        {
          columns: [
            {
              text: `(   ${
                dataBill.NotifierName
                  ? dataBill.NotifierName
                  : "_________________________"
              }  )`,
              style: "textAlign",
            },
            { text: "", width: 150 },
            {
              text: `   (   ${dataBill.ContactPersonName}   )    `,
              style: "textAlign",
            },
          ],
          margin: [35, 5, 0, 0],
        },
        {
          columns: [
            {
              text: `  ลงชื่อผู้ดำเนินงาน `,
              style: "textAlign",
            },
            { text: "", width: 170 },
            {
              text: "ผู้เเจ้งรับทราบเเล้ว",
              style: "textAlign",
            },
          ],
          margin: [40, 5, 0, 0],
        },

        {
          columns: [
            {
              text:
                "..........................................................",
              style: "textAlign",
            },
          ],
          margin: [0, 50, 0, 0],
        },
        {
          columns: [
            {
              text: ` ( ${
                dataBill.ApprovName
                  ? dataBill.ApprovName
                  : "_________________________"
              } ) `,
              style: "textAlign",
            },
            { text: "", width: 150 },
          ],
          margin: [35, 5, 0, 0],
        },
        {
          columns: [
            { text: "", width: 5 },
            {
              text: " ผู้จัดการรับทราบ ",
              style: "textAlign",
            },
            { text: "", width: 170 },
          ],
          margin: [45, 5, 0, 0],
        },
      ],
      defaultStyle: {
        font: "Sarabun",
      },
      styles: {
        header: {
          fontSize: 24,
          bold: true,
          alignment: "center",
        },
        title: {
          fontSize: 14,
          bold: true,
          alignment: "left",
          margin: [0, 20, 0, 0],
        },
        textAlign: {
          fontSize: 12,
          alignment: "left",
          margin: [20, 0, 0, 0],
        },
        marginLeft: {
          margin: [20, 0, 0, 0],
        },
        text: {
          fontSize: 12,
        },
      },
    };
    setTimeout(async () => {
      await createPDF(docDefinition);
      return { result: true };
    }, 500);
  } catch (error) {
    return { result: false, message: error };
  }
};

const textToBase64Barcode = (text) => {
  const canvas = document.createElement("canvas");
  JsBarcode(canvas, text, { format: "CODE39" });
  return canvas.toDataURL("image/png");
};

const createPDF = async (PdfForm) => {
  let docDefinition = PdfForm;
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  pdfMake.fonts = {
    // download default Roboto font from cdnjs.com
    // Roboto: {
    //   normal:
    //     "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf",
    //   bold: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf",
    //   italics:
    //     "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf",
    //   bolditalics:
    //     "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf",
    // },
    Sarabun: {
      normal: "Sarabun-Regular.ttf",
      bold: "Sarabun-Medium.ttf",
      italics: "Sarabun-Italic.ttf",
      bolditalics: "Sarabun-MediumItalic.ttf",
    },
  };
  await pdfMake.createPdf(docDefinition).open();
};

const convertImg = async (data) => {
  // console.log('Backend', data)
  const result = await axios.post(apiConvertImg, { UrlIMG: data });
  return `data:image/jpeg;base64,${result.data.result}`;
};

const convertImgMppPrint = async (data) => {
  const result = await axios.post(
    "http://192.168.3.5:3000/convertImgMppPrint",
    data
  );
  return result.data;
};

const printBillMaterial = async (data) => {
  const barcodeBill = textToBase64Barcode(data.Bill_ID);
  // console.log(barcodeBill)
  const logoHeader = await convertImg(
    "http://192.168.3.5:3000/picture/PICTURE2/Art%20Event%20Logo2.jpg"
  );
  const dataConvert = await convertImgMppPrint(data.product);
  // console.log("data : ", data);
  dataConvert.sort((a, b) =>
    a.ItemNo > b.ItemNo ? 1 : b.ItemNo > a.ItemNo ? -1 : 0
  );
  const borderColorHeader = ["#000000", "#000000", "#000000", "#000000"];

  var dataSumInv = [];
  dataSumInv.push([
    { text: "ลำดับที่", style: "bgColorHeaderPrintTable" },
    { text: "รหัสพลอย", style: "bgColorHeaderPrintTable" },

    { text: "จำนวน", style: "bgColorHeaderPrintTable" },
  ]);

  let dataBody = [
    [
      {
        text: "รายการที่",
        alignment: "center",
        rowSpan: 2,
        style: "bgColorHeaderPrintTable",
        borderColor: borderColorHeader,
        margin: [0, 10, 0, 0],
      },
      {
        text: "รหัสสินค้า",
        style: "bgColorHeaderPrintTable",
        alignment: "center",
        rowSpan: 2,
        borderColor: borderColorHeader,
        margin: [0, 10, 0, 0],
      },
      {
        text: "รายการพลอย",
        style: "bgColorHeaderPrintTable",
        alignment: "center",
        colSpan: 2,
        borderColor: borderColorHeader,
      },
      {},
    ],
    [
      {},
      {},
      {
        text: "รหัสพลอย",
        style: "bgColorHeaderPrintTable",
        alignment: "center",
        borderColor: borderColorHeader,
      },
      {
        text: "จำนวนที่โอน",
        style: "bgColorHeaderPrintTable",
        alignment: "center",
        borderColor: borderColorHeader,
      },
    ],
  ];

  dataConvert.forEach((obj) => {
    var vertical_center = 24;
    // var vertical_center_pict = 0;
    // obj.stone.length == 1 ? vertical_center = 16 : vertical_center = (vertical_center * obj.stone.length) / 2  , vertical_center_pict = vertical_center - 15 ;
    obj.inventory.forEach((dataProduct) => {
      dataBody.push([
        {
          text: obj.ItemNo,
          style: "text",
          alignment: "center",
          rowSpan: obj.inventory.length,
          margin: [0, vertical_center, 0, 0],
        }, // ItemNo
        {
          rowSpan: obj.inventory.length,
          stack: [
            {
              image: obj.PDFPict,
              alignment: "center",
              width: 60,
              style: "text",
            },
            {
              text: obj.ProductCode,
              alignment: "center",
              style: "text",
            },
            {
              text: obj.ProductID,
              alignment: "center",
              style: "text",
            },
          ],
        }, // รูป รหัสสินค้า
        {
          text: dataProduct.InvCode,
          alignment: "center",
          style: "text",
        }, // รหัสพลอย
        {
          text: dataProduct.SendQty.toLocaleString(),
          alignment: "center",
          style: "text",
        }, // จำนวนที่โอน
      ]);
    });
  });

  data.sumInv.forEach((dataSum, indexSumInv) => {
    dataSumInv.push([
      { text: indexSumInv + 1, style: "bgColorHeaderPrintTable2" },
      { text: dataSum.InvCode, style: "bgColorHeaderPrintTable2" },
      {
        text: dataSum.SumQty.toLocaleString(),
        style: "bgColorHeaderPrintTable2",
      },
    ]);
  });

  const docDefinition = {
    content: [
      //Header Logo และ JobNumber
      {
        columns: [
          {
            image: logoHeader,
            width: 150,
            alignment: "center",
          },

          { text: "", width: 230 },

          {
            table: {
              heights: [20, 5],
              body: [
                [
                  {
                    text: "Barcode",
                    alignment: "center",
                    margin: [0, 10, 0, 0],
                  },
                  {
                    image: barcodeBill,
                    height: 40,
                    width: 80,
                    alignment: "center",
                  },
                ],

                [
                  {
                    text: `เลขที่เอกสาร :  ${data.BillNumber}  `,
                    colSpan: 2,
                    alignment: "center",
                    fontSize: 9,
                  },
                ],
              ],
            },
            alignment: "center",
          },
        ],
      },
      " ",
      " ",
      {
        columns: [
          {
            text: `ผู้ส่ง :  ${data.EmpNameSender}  `,
          },
        ],
      },
      {
        columns: [
          {
            text: `วันที่ส่ง :  ${moment(data.BillDate).format("L")}  `,
          },
        ],
      },
      {
        columns: [
          {
            text: `Order :  ${data.OrderNumber}  `,
          },
        ],
      },
      {
        columns: [
          {
            text: `Fac Team :  ${data.FactoryTeam}  `,
          },
        ],
      },
      " ",
      {
        table: {
          // headerRows: 2,
          // dontBreakRows:true,
          heights: [15, 15, 25, 25, 25, 25, 25, 25],
          widths: [30, 100, 100, 50],
          body: dataBody,
        },
      },
      " ",
      " ",
      " ",
      " ",
      {
        width: "*",
        table: {
          dontBreakRows: true,
          heights: [10, 10],
          widths: [30, 160, 99],
          body: dataSumInv,
        },
        alignment: "center",
      },
    ],
    defaultStyle: {
      font: "Sarabun",
    },
    styles: {
      fontTest: {
        font: "3OF9",
      },
      header: {
        fontSize: 24,
        bold: true,
        alignment: "center",
      },
      title: {
        fontSize: 14,
        bold: true,
        alignment: "left",
        margin: [0, 20, 0, 0],
      },
      textAlign: {
        fontSize: 12,
        alignment: "left",
        margin: [20, 0, 0, 0],
      },
      marginLeft: {
        margin: [20, 0, 0, 0],
      },
      text: {
        fontSize: 6,
      },
      bgColorHeaderPrintTable: {
        fillColor: "#E7FBBE",
        fontSize: 8,
        // bold: true,
        alignment: "center",
      },
      bgColorHeaderPrintTable2: {
        fillColor: "#FFFDDE",
        fontSize: 8,
        // bold: true,
        alignment: "center",
      },
    },
  };
  await createPDF(docDefinition);
};

const printReportRepairDoc = async (data) => {
  console.log(data);
  let rows = [
    [
      {
        text: "วันที่เเจ้ง",
        style: "bgColorHeaderPrintTable",
        alignment: "center",
      },
      {
        text: "ชั้น",
        style: "bgColorHeaderPrintTable",
        alignment: "center",
      },
      {
        text: "ห้อง",
        style: "bgColorHeaderPrintTable",
        alignment: "center",
      },
      {
        text: "ผู้เเจ้ง",
        style: "bgColorHeaderPrintTable",
        alignment: "center",
      },
      {
        text: "เบอร์",
        style: "bgColorHeaderPrintTable",
        alignment: "center",
      },
      {
        text: "อุปกรณ์ที่เสีย",
        style: "bgColorHeaderPrintTable",
        alignment: "center",
      },
      {
        text: "เลขเครื่อง",
        style: "bgColorHeaderPrintTable",
        alignment: "center",
      },
      {
        text: "อาการเสีย",
        style: "bgColorHeaderPrintTable",
        alignment: "center",
      },
      {
        text: "กำหนดเสร็จ (วัน)",
        style: "bgColorHeaderPrintTable",
        alignment: "center",
      },
      {
        text: "กำหนดเสร็จใน(วัน)",
        style: "bgColorHeaderPrintTable",
        alignment: "center",
      },
      {
        text: "เเก้เเล้ว",
        style: "bgColorHeaderPrintTable",
        alignment: "center",
      },
      {
        text: "วิธีเเก้ไข",
        style: "bgColorHeaderPrintTable",
        alignment: "center",
      },
    ],
  ];
  data.forEach((dataObj) => {
    rows.push([
      {
        text: `(${dataObj.dowJobDate}) ${moment(dataObj.JobDate).format("L")}`,
        style: "rowRecode",
        alignment: "center",
      },
      {
        text: dataObj.FloorName,
        style: "rowRecode",
        alignment: "center",
      },
      { text: dataObj.RoomName, style: "rowRecode", alignment: "center" },
      {
        text: dataObj.ContactPersonName,
        style: "rowRecode",
        alignment: "center",
      },
      { text: dataObj.Tel, style: "rowRecode", alignment: "center" },
      { text: dataObj.CategoryName, style: "rowRecode", alignment: "center" },
      {
        text: dataObj.DeviceNo === "null" ? "" : dataObj.DeviceNo,
        style: "rowRecode",
        alignment: "center",
      },
      { text: dataObj.BrokenDes, style: "rowRecode", alignment: "center" },
      {
        text: `(${dataObj.dowJobDate}) ${moment(dataObj.DueDate).format("L")}`,
        style: "rowRecode",
        alignment: "center",
      },
      {
        text: dataObj.DateWIP,
        style: "rowRecode",
        alignment: "center",
      },
      { text: "", style: "rowRecode" },
      {
        text: dataObj.RepairDes === null ? " " : dataObj.RepairDes,
        style: "rowRecode",
      },
    ]);
  });
  const docDefinition = {
    pageSize: "A4",
    pageOrientation: "landscape",
    pageMargins: [10, 10, 10, 10],
    content: [
      " ",
      {
        width: "*",
        table: {
          dontBreakRows: true,
          widths: [45, 30, 45, 50, 20, 65, 40, 150, 45, 45, 28, 150],
          body: rows,
        },
      },
    ],
    defaultStyle: {
      font: "Sarabun",
    },
    styles: {
      header: {
        fontSize: 10,
        bold: true,
        alignment: "center",
      },
      rowRecode: {
        fontSize: 8,
        // alignment: "center",
      },
      title: {
        fontSize: 14,
        bold: true,
        alignment: "left",
        margin: [0, 20, 0, 0],
      },
      textAlign: {
        fontSize: 12,
        alignment: "left",
        margin: [20, 0, 0, 0],
      },
      marginLeft: {
        margin: [20, 0, 0, 0],
      },
      fonSize10: {
        fontSize: 10,
      },
      fonSize8: {
        fontSize: 8,
      },
      bgColorHeaderPrintTable: {
        fillColor: "#FFC107",
        fontSize: 9,
        bold: true,
        alignment: "center",
      },
    },
  };
  await createPDF(docDefinition);
};

const printCastingByOrder = async (data) => {
  // console.log('data : ' , data)
  const borderColorHeader = ["#000000", "#000000", "#000000", "#000000"];
  let rows = [
    [
      {
        text: "OrderNumber",
        alignment: "center",
        style: "bgColorHeaderPrintTable",
        borderColor: borderColorHeader,
      },
      {
        text: "วันที่สร้าง Order",
        style: "bgColorHeaderPrintTable",
        alignment: "center",
        borderColor: borderColorHeader,
      },
      {
        text: "สั่งผลิตทั้งหมด",
        style: "bgColorHeaderPrintTable",
        alignment: "center",
        borderColor: borderColorHeader,
      },
      {
        text: "หล่อซ่อม",
        style: "bgColorHeaderPrintTable",
        alignment: "center",
        borderColor: borderColorHeader,
      },
      {
        text: "รับคืน",
        style: "bgColorHeaderPrintTable",
        alignment: "center",
        borderColor: borderColorHeader,
      },
      {
        text: "หล่อ",
        style: "bgColorHeaderPrintTable",
        alignment: "center",
        borderColor: borderColorHeader,
      },
      {
        text: "หล่ออื่นๆ",
        style: "bgColorHeaderPrintTable",
        alignment: "center",
        borderColor: borderColorHeader,
      },
      {
        text: "DIEF",
        style: "bgColorHeaderPrintTable",
        alignment: "center",
        borderColor: borderColorHeader,
      },
      {
        text: "สถานะ",
        style: "bgColorHeaderPrintTable",
        alignment: "center",
        borderColor: borderColorHeader,
      },
    ],
  ];
  data.forEach((dataObj) => {
    rows.push([
      { text: dataObj.OrderNumber, style: "rowRecode", alignment: "center" },
      {
        text: `(${dataObj.thaiDate}) ${moment(dataObj.OrderDate).format("L")}`,
        style: "rowRecode",
        alignment: "center",
      },
      { text: dataObj.JobQty, style: "rowRecode", alignment: "center" },
      {
        text: dataObj.TotalBillRepairCasting,
        style: "rowRecode",
        alignment: "center",
      },
      {
        text: dataObj.TotalReturnRepairCasting,
        style: "rowRecode",
        alignment: "center",
      },
      {
        text: dataObj.TotalCastingNormal,
        style: "rowRecode",
        alignment: "center",
      },
      {
        text: dataObj.TotalCastingSample,
        style: "rowRecode",
        alignment: "center",
      },
      {
        text: dataObj.TotalBillRepairCasting - dataObj.TotalReturnRepairCasting,
        alignment: "center",
        style:
          dataObj.TotalBillRepairCasting - dataObj.TotalReturnRepairCasting ===
          0
            ? "rowRecode"
            : "rowRecode bold",
        color:
          dataObj.TotalBillRepairCasting - dataObj.TotalReturnRepairCasting ===
          0
            ? "gray"
            : "black",
      },
      { text: dataObj.Status, style: "rowRecode", alignment: "center" },
      //? "หล่อไม่ครบ" : "หล่อเกินจำนวน"
    ]);
  });

  const docDefinition = {
    pageSize: "A4",
    pageOrientation: "landscape",
    pageMargins: [10, 10, 10, 10],
    content: [
      // {
      //   text: `รายการหล่อของ Order : ${data[0].OrderNumber}`,
      //   alignment: "center",
      //   fontSize: 23,
      //   bold: true,
      // },
      " ",
      {
        width: "*",
        table: {
          dontBreakRows: true,
          widths: ["*", "*", "*", "*", "*", "*", "*", "*", "*"],
          body: rows,
        },
      },
    ],
    defaultStyle: {
      font: "Sarabun",
    },
    styles: {
      header: {
        fontSize: 10,
        bold: true,
        alignment: "center",
      },
      rowRecode: {
        fontSize: 8,
        // alignment: "center",
      },
      bold: {
        bold: true,
      },
      gray: {
        color: "gray",
      },
      title: {
        fontSize: 14,
        bold: true,
        alignment: "left",
        margin: [0, 20, 0, 0],
      },
      textAlign: {
        fontSize: 12,
        alignment: "left",
        margin: [20, 0, 0, 0],
      },
      marginLeft: {
        margin: [20, 0, 0, 0],
      },
      fonSize10: {
        fontSize: 10,
      },
      fonSize8: {
        fontSize: 8,
      },
      bgColorHeaderPrintTable: {
        fillColor: "#40DFEF",
        fontSize: 10,
        bold: true,
        alignment: "center",
      },
    },
  };
  await createPDF(docDefinition);
};

const printCastingByItem = async (data) => {
  const dataConvert = await convertImgMppPrint(data);
  //console.log('เเปลงเเล้ว : ' , dataConvert)
  var vertical_center = 20;

  const borderColorHeader = ["#000000", "#000000", "#000000", "#000000"];
  let rows = [
    [
      {
        text: "รายการที่",
        alignment: "center",
        style: "bgColorHeaderPrintTable",
        borderColor: borderColorHeader,
      },
      {
        text: "สินค้า",
        style: "bgColorHeaderPrintTable",
        alignment: "center",
        borderColor: borderColorHeader,
      },
      {
        text: "JobNumber",
        style: "bgColorHeaderPrintTable",
        alignment: "center",
        borderColor: borderColorHeader,
      },
      {
        text: "ผลิต",
        style: "bgColorHeaderPrintTable",
        alignment: "center",
        borderColor: borderColorHeader,
      },
      {
        text: "หล่อซ่อม",
        style: "bgColorHeaderPrintTable",
        alignment: "center",
        borderColor: borderColorHeader,
      },
      {
        text: "รับคืน",
        style: "bgColorHeaderPrintTable",
        alignment: "center",
        borderColor: borderColorHeader,
      },
      {
        text: "หล่อ",
        style: "bgColorHeaderPrintTable",
        alignment: "center",
        borderColor: borderColorHeader,
      },
      {
        text: "หล่ออื่นๆ",
        style: "bgColorHeaderPrintTable",
        alignment: "center",
        borderColor: borderColorHeader,
      },
      {
        text: "DIFF",
        style: "bgColorHeaderPrintTable",
        alignment: "center",
        borderColor: borderColorHeader,
      },
      {
        text: "สถานะ",
        style: "bgColorHeaderPrintTable",
        alignment: "center",
        borderColor: borderColorHeader,
      },
    ],
  ];
  data.forEach((dataObj, index) => {
    rows.push([
      {
        text: dataObj.OrderItemNo,
        style: "rowRecode",
        alignment: "center",
        margin: [0, vertical_center, 0, 0],
      },
      { image: dataConvert[index].PDFPict, width: 80, alignment: "center" },
      {
        text: dataObj.JobNumber,
        style: "rowRecode",
        alignment: "center",
        margin: [0, vertical_center, 0, 0],
      },
      {
        text: dataObj.JobQty,
        style: "rowRecode",
        alignment: "center",
        margin: [0, vertical_center, 0, 0],
      },
      {
        text: dataObj.TotalRepairCasting,
        style: "rowRecode",
        alignment: "center",
        margin: [0, vertical_center, 0, 0],
      },
      {
        text: dataObj.TotalReturnRepairCasting,
        style: "rowRecode",
        alignment: "center",
        margin: [0, vertical_center, 0, 0],
      },
      {
        text: dataObj.TotalCastingNormal,
        style: "rowRecode",
        alignment: "center",
        margin: [0, vertical_center, 0, 0],
      },
      {
        text: dataObj.TotalCastingSample,
        style: "rowRecode",
        alignment: "center",
        margin: [0, vertical_center, 0, 0],
      },
      {
        text: dataObj.TotalRepairCasting - dataObj.TotalReturnRepairCasting,
        style:
          dataObj.TotalRepairCasting - dataObj.TotalReturnRepairCasting > 0
            ? "rowRecode bold"
            : "rowRecode",
        alignment: "center",
        color:
          dataObj.TotalRepairCasting - dataObj.TotalReturnRepairCasting > 0
            ? "black"
            : "gray",
        margin: [0, vertical_center, 0, 0],
      },
      {
        text:
          dataObj.TotalRepairCasting === 0
            ? "ไม่มีหล่อซ่อม"
            : dataObj.TotalRepairCasting > dataObj.TotalReturnRepairCasting
            ? "ยังรับกลับไม่ครบ"
            : "รับกลับครบแล้ว",
        style: "rowRecode",
        alignment: "center",
        margin: [0, vertical_center, 0, 0],
      },
    ]);
  });

  const docDefinition = {
    pageSize: "A4",
    pageOrientation: "landscape",
    pageMargins: [10, 10, 10, 10],
    content: [
      {
        text: `รายการหล่อของ Order : ${data[0].OrderNumber}`,
        alignment: "center",
        fontSize: 23,
        bold: true,
      },
      " ",
      {
        width: "*",
        table: {
          dontBreakRows: true,
          widths: [40, "*", 60, "*", "*", "*", "*", "*", "*", 60],
          body: rows,
        },
      },
    ],
    defaultStyle: {
      font: "Sarabun",
    },
    styles: {
      header: {
        fontSize: 10,
        bold: true,
        alignment: "center",
      },
      rowRecode: {
        fontSize: 8,
        // alignment: "center",
      },
      title: {
        fontSize: 14,
        bold: true,
        alignment: "left",
        margin: [0, 20, 0, 0],
      },
      textAlign: {
        fontSize: 12,
        alignment: "left",
        margin: [20, 0, 0, 0],
      },
      marginLeft: {
        margin: [20, 0, 0, 0],
      },
      fonSize10: {
        fontSize: 10,
      },
      fonSize8: {
        fontSize: 8,
      },
      bgColorHeaderPrintTable: {
        fillColor: "#40DFEF",
        fontSize: 10,
        bold: true,
        alignment: "center",
      },
    },
  };
  await createPDF(docDefinition);
};

const printSlip = async (data) => {
  const logoHeader = await convertImg(
    "http://192.168.3.5:3000/picture/PICTURE2/Art%20Event%20Logo2.jpg"
  );
  //console.log("data : ", data);
  const dataConvert = await convertImgMppPrint(data);

  const borderColorHeader = ["#40DFEF", "#40DFEF", "#40DFEF", "#40DFEF"];
  let rows = [
    [
      {
        text: "No.",
        alignment: "center",
        style: "bgColorHeaderPrintTable",
        borderColor: borderColorHeader,
      },
      {
        text: "Code/Order No.",
        style: "bgColorHeaderPrintTable",
        alignment: "center",
        borderColor: borderColorHeader,
      },
      {
        text: "จำนวน/นน.",
        style: "bgColorHeaderPrintTable",
        alignment: "center",
        borderColor: borderColorHeader,
      },
      {
        text: "รูป",
        style: "bgColorHeaderPrintTable",
        alignment: "center",
        borderColor: borderColorHeader,
      },
    ],
  ];
  data.forEach((dataObj, index) => {
    rows.push([
      {
        text: index + 1,
        style: "rowRecode",
        alignment: "center",
        margin: [0, 10, 0, 0],
      },
      {
        stack: [
          {
            text: dataObj.OrderNumber,
            style: "rowRecode",
            alignment: "left",
          },
          { text: dataObj.JobNumber, style: "rowRecode", alignment: "left" },
          {
            text: dataObj.TotalCastingNormal,
            style: "rowRecode",
            alignment: "left",
          },
        ],
        margin: [0, 10, 0, 0],
      },
      {
        stack: [
          { text: dataObj.JobQty, style: "rowRecode", alignment: "right" },
          { text: dataObj.JobQty, style: "rowRecode", alignment: "right" },
        ],
        margin: [0, 10, 0, 0],
      },
      //{ image: logoHeader, width: 80, alignment: "center" },
      { image: dataConvert[index].PDFPict, width: 80, alignment: "center" },
    ]);
  });

  const docDefinition = {
    pageSize: {
      width: 300,
      height: "auto",
    },
    pageOrientation: "portrait",
    pageMargins: [10, 10, 10, 10],
    content: [
      {
        image: logoHeader,
        width: 150,
        alignment: "center",
      },
      {
        text: `เลขที่ :      ${data[0].OrderNumber}`,
        //alignment: "center",
        fontSize: 10,
        //bold: true,
      },
      {
        columns: [
          {
            // text: `โอนจาก : ${data[0].ProductID}`,
            text: `โอนจาก :  เเต่ง`,
            //alignment: "center",
            fontSize: 10,
            //bold: true,
          },
          {
            text: "",
            width: 119,
          },
          {
            // text: `วันที่ : ${data[0].ProductID}`,
            text: `วันที่ :  27/05/2022`,
            //alignment: "center",
            fontSize: 10,
            //bold: true,
          },
        ],
      },
      {
        columns: [
          {
            // text: `โอนไป : ${data[0].ProductID}`,
            text: `โอนไป :     ขัด`,
            //alignment: "center",
            fontSize: 10,
            //bold: true,
          },
          {
            text: "",
            width: 118,
          },
          {
            // text: `เวลา : ${data[0].ProductID}`,
            text: `เวลา :  19:36`,
            //alignment: "center",
            fontSize: 10,
            //bold: true,
          },
        ],
      },
      " ",
      {
        width: "*",
        table: {
          headerRows: 1,
          //dontBreakRows: true,
          widths: [16, 90, 50, 80],
          body: rows,
        },
        layout: {
          hLineWidth: function(i, node) {
            return i === 0 || i === node.table.body.length ? 2 : 1;
          },
          vLineWidth: function(i, node) {
            return i === 0 || i === node.table.widths.length ? 2 : 1;
          },
          hLineColor: function() {
            return "gray";
          },
          vLineColor: function() {
            return "white";
          },
          hLineStyle: function(i, node) {
            if (i === 0 || i === node.table.body.length) {
              return null;
            }
            if (i === 1 || i === node.table.body.length) {
              return null;
            }
            return { dash: { length: 10, space: 4 } };
          },
          vLineStyle: function(i, node) {
            if (i === 0 || i === node.table.widths.length) {
              return null;
            }
            return { dash: { length: 4 } };
          },
          // paddingLeft: function(i, node) { return 4; },
          // paddingRight: function(i, node) { return 4; },
          // paddingTop: function(i, node) { return 2; },
          // paddingBottom: function(i, node) { return 2; },
          // fillColor: function (i, node) { return null; }
        },
      },
    ],
    defaultStyle: {
      font: "Sarabun",
    },
    styles: {
      header: {
        fontSize: 10,
        bold: true,
        alignment: "center",
      },
      rowRecode: {
        fontSize: 8,
        // alignment: "center",
      },
      title: {
        fontSize: 14,
        bold: true,
        alignment: "left",
        margin: [0, 20, 0, 0],
      },
      textAlign: {
        fontSize: 12,
        alignment: "left",
        margin: [20, 0, 0, 0],
      },
      marginLeft: {
        margin: [20, 0, 0, 0],
      },
      fonSize10: {
        fontSize: 10,
      },
      fonSize8: {
        fontSize: 8,
      },
      bgColorHeaderPrintTable: {
        fillColor: "#40DFEF",
        fontSize: 10,
        bold: true,
        alignment: "center",
      },
    },
  };
  await createPDF(docDefinition);
};

const printFacWipStatus = async (data) => {
  // console.log(data)
  const borderColorHeader = ["#808080", "#808080", "#808080", "#808080"];
  // console.log(data);
  let dataBody = [];
  // dataBody.push({ text: "Fact Wip", style: "header" }) // header
  data.forEach((objMaster) => {
    //row 1
    let row1 = [
      {
        text: `FAC : ${objMaster.ProductionTeam}`,
        colSpan: 2,
        alignment: "center",
        borderColor: borderColorHeader,
        color: "blue",
        style: "fonSize10",
      },
      {},
      {
        text: objMaster.OrderNumber,
        colSpan: 7,
        alignment: "center",
        borderColor: borderColorHeader,
        style: "fonSize10",
      },
      {},
      {},
      {},
      {},
      {},
      {},
      {
        text: `จำนวน : ${objMaster.TotalQty.toLocaleString()}`,
        colSpan: "5",
        alignment: "center",
        borderColor: borderColorHeader,
        style: "fonSize10",
      },
      {},
      {},
      {},
      {},
      {
        text: `DL : ${moment(objMaster.DueDate).format("L")}`,
        colSpan: 4,
        alignment: "center",
        borderColor: borderColorHeader,
        style: "fonSize10",
        color:
          objMaster.TotalDay >= 3
            ? "green"
            : objMaster.TotalDay >= 0 && objMaster.TotalDay < 3
            ? "orange"
            : "red",
      },
      {},
      {},
      {},
    ];
    objMaster.headerMonth.forEach((objHeaderMonth) => {
      //row 1
      row1.push({
        text: objHeaderMonth.month,
        colSpan: objHeaderMonth.count,
        alignment: "center",
        borderColor: borderColorHeader,
        style: "fonSize8",
      });
      for (let r = 1; r < objHeaderMonth.count; r++) {
        row1.push({});
      }
    });

    //row 2
    let row2 = [
      {
        text: `วัตถุดิบ`,
        alignment: "center",
        borderColor: borderColorHeader,
        style: "HeaderProcess",
      },
      {
        text: `สถานะ`,
        alignment: "center",
        borderColor: borderColorHeader,
        style: "HeaderProcess",
      },
      {
        text: `หัวข้อ`,
        alignment: "center",
        borderColor: borderColorHeader,
        style: "HeaderProcess",
      },
    ];
    row2 = row2.concat(
      objMaster.Process.map((objProcess) => {
        return {
          text:
            objProcess.PDProcessCode === "11"
              ? "ชุบ"
              : objProcess.PDProcessName,
          alignment: "center",
          borderColor: borderColorHeader,
          style: "HeaderProcess",
        };
      })
    );
    row2.push({
      text: `แผน\nส่ง\nQA`,
      alignment: "center",
      borderColor: borderColorHeader,
      style: "bgColorHeaderPrintTable",
    });
    row2 = row2.concat(
      objMaster.qaCalender.map((objProcess) => {
        return {
          text: [
            {
              text: objProcess.Dow + "\n",
              alignment: "center",
            },
            {
              text: "\n" + moment(objProcess.DayWip).format("D"),
              alignment: "center",
            },
          ],
          alignment: "center",
          borderColor: borderColorHeader,
          style: "bgColorHeaderPrintTable",
        };
      })
    );

    //row 3
    let row3 = [
      {
        text: `พลอย`,
        alignment: "center",
        borderColor: borderColorHeader,
        style: `${
          objMaster.statusStone.QtyReq <= 0
            ? "withoutInv"
            : objMaster.statusStone.LateDay > 3
            ? "normalInv"
            : objMaster.statusStone.LateDay >= 0 &&
              objMaster.statusStone.LateDay <= 3
            ? "warningInv"
            : "lateInv"
        }`,
      },
      {
        text: objMaster.statusStone.QtyReq
          ? objMaster.statusStone.IsFinish
            ? "จบ"
            : objMaster.statusStone.LateDay
          : "",
        alignment: "center",
        borderColor: borderColorHeader,
        style: `${
          objMaster.statusStone.LateDay > 3
            ? "FontColorGreen"
            : objMaster.statusStone.LateDay >= 0 &&
              objMaster.statusStone.LateDay <= 3
            ? "FontColorOrange"
            : "FontColorRed"
        }`,
        margin: [-3, 4, -3, 0],
      },
      {
        text: `กำหนด\nเสร็จ`,
        alignment: "center",
        borderColor: borderColorHeader,
        style: "bgColorHeaderPrintTable",
      },
    ];
    row3 = row3.concat(
      objMaster.Process.map(() => {
        return {
          text: "_/_/_",
          alignment: "center",
          borderColor: borderColorHeader,
          style: "textNoData",
        };
      })
    );
    row3.push({
      text: `เป้า\nแรก`,
      alignment: "center",
      borderColor: borderColorHeader,
      style: "bgColorHeaderPrintTable",
    });
    row3 = row3.concat(
      objMaster.qaCalender.map((objCalender) => {
        return {
          text: objCalender.FirstTarget
            ? objCalender.FirstTarget.toLocaleString()
            : "",
          alignment: "center",
          borderColor: borderColorHeader,
          style:
            objMaster.DueDate === objCalender.DayWip
              ? "dueSales"
              : objMaster.CustomerDueDate === objCalender.DayWip
              ? "dueCus"
              : convertDate_JS_TO_SQL(objCalender.DayWip) >
                convertDate_JS_TO_SQL(objMaster.DueDate)
              ? "fontLate"
              : "title",
        };
      })
    );

    //row 4
    let row4 = [
      {
        text: `อะไหล่`,
        alignment: "center",
        borderColor: borderColorHeader,
        style: "withoutInv",
      },
      {
        text: "",
        alignment: "center",
        borderColor: borderColorHeader,
        style: "bgColorHeaderPrintTable",
      },
      {
        text: `จำนวน\nค้าง`,
        alignment: "center",
        borderColor: borderColorHeader,
        style: "bgColorHeaderPrintTable",
      },
    ];
    row4 = row4.concat(
      objMaster.Process.map((objProcess) => {
        return {
          text: objProcess.TotalInProcess
            ? objProcess.TotalInProcess.toLocaleString()
            : "",
          alignment: "center",
          borderColor: borderColorHeader,
          style: "title",
        };
      })
    );
    row4.push({
      text: `เป้า\nล่าสุด`,
      alignment: "center",
      borderColor: borderColorHeader,
      style: "bgColorHeaderPrintTable",
    });
    row4 = row4.concat(
      objMaster.qaCalender.map((objCalender) => {
        return {
          text: objCalender.LastTarget
            ? objCalender.LastTarget.toLocaleString()
            : "",
          alignment: "center",
          borderColor: borderColorHeader,
          style:
            objMaster.DueDate === objCalender.DayWip
              ? "dueSales"
              : objMaster.CustomerDueDate === objCalender.DayWip
              ? "dueCus"
              : convertDate_JS_TO_SQL(objCalender.DayWip) >
                convertDate_JS_TO_SQL(objMaster.DueDate)
              ? "fontLate"
              : "title",
        };
      })
    );

    //row 5
    let row5 = [
      {
        text: "WD",
        alignment: "center",
        borderColor: borderColorHeader,
        style: "HeaderProcess",
      },
      {
        text: "TTD",
        alignment: "center",
        borderColor: borderColorHeader,
        style: "HeaderProcess",
      },
      {
        text: `เลท\nแผนก`,
        alignment: "center",
        borderColor: borderColorHeader,
        style: "bgColorHeaderPrintTable",
      },
    ];
    row5 = row5.concat(
      objMaster.Process.map(() => {
        return {
          text: "",
          alignment: "center",
          borderColor: borderColorHeader,
          style: "title",
        };
      })
    );
    row5.push({
      text: `ยอด\nส่งจริง`,
      alignment: "center",
      borderColor: borderColorHeader,
      style: "bgColorHeaderPrintTable",
    });
    row5 = row5.concat(
      objMaster.qaCalender.map((objCalender) => {
        return {
          text: objCalender.ToQa ? objCalender.ToQa.toLocaleString() : "",
          alignment: "center",
          borderColor: borderColorHeader,
          style:
            objMaster.DueDate === objCalender.DayWip
              ? "dueSales"
              : objMaster.CustomerDueDate === objCalender.DayWip
              ? "dueCus"
              : convertDate_JS_TO_SQL(objCalender.DayWip) >
                convertDate_JS_TO_SQL(objMaster.DueDate)
              ? "fontLate"
              : "title",
        };
      })
    );

    //row 6
    let row6 = [
      {
        text: objMaster.WorkingDay,
        alignment: "center",
        borderColor: borderColorHeader,
        style:
          objMaster.WorkingDay >= 3
            ? "FontColorGreen"
            : objMaster.WorkingDay >= 0 && objMaster.WorkingDay < 3
            ? "FontColorOrange"
            : "FontColorRed",
        margin: [-3, 4, -3, 0],
      },
      {
        text: objMaster.TotalDay,
        alignment: "center",
        borderColor: borderColorHeader,
        style:
          objMaster.TotalDay >= 3
            ? "FontColorGreen"
            : objMaster.TotalDay >= 0 && objMaster.TotalDay < 3
            ? "FontColorOrange"
            : "FontColorRed",
        margin: [-3, 4, -3, 0],
      },
      {
        text: `แผนงาน`,
        alignment: "center",
        borderColor: borderColorHeader,
        style: "HeaderProcess",
      },
    ];
    row6 = row6.concat(
      objMaster.Process.map((objProcess, indexProcess) => {
        return {
          text: "",
          alignment: "center",
          colSpan: indexProcess === 0 ? objMaster.Process.length : 1,
          borderColor: borderColorHeader,
          style: "title",
        };
      })
    );
    row6.push({
      text: `ยอด\nค้างส่ง`,
      alignment: "center",
      borderColor: borderColorHeader,
      style: "bgColorHeaderPrintTable",
    });
    row6 = row6.concat(
      objMaster.qaCalender.map((objCalender) => {
        return {
          text:
            (objCalender.BalanceQty || objCalender.ToQa) &&
            convertDate_JS_TO_SQL(new Date()) >=
              convertDate_JS_TO_SQL(objCalender.DayWip)
              ? objCalender.ToQa && !objCalender.BalanceQty
                ? "จบ"
                : objCalender.BalanceQty.toLocaleString()
              : "",
          alignment: "center",
          borderColor: borderColorHeader,
          style:
            objMaster.DueDate === objCalender.DayWip
              ? "dueSales"
              : objMaster.CustomerDueDate === objCalender.DayWip
              ? "dueCus"
              : convertDate_JS_TO_SQL(objCalender.DayWip) >
                convertDate_JS_TO_SQL(objMaster.DueDate)
              ? "fontLate"
              : "title",
        };
      })
    );
    // console.log([...row1, row2, row3, row4].length, getWidhtCol([...row1, row2, row3, row4].length).length)
    dataBody.push({
      style: "tableExample",
      table: {
        widths: getWidhtCol([...row1, row2, row3, row4].length),
        body: [row1, row2, row3, row4, row5, row6],
      },
      layout: {
        hLineWidth: function() {
          return 0.00001;
        },
        vLineWidth: function() {
          return 0.00001;
        },
      },
    });
    dataBody.push({ text: " ", style: "" }); // เว้นช่องแต่ละ Table
  });

  // console.log(dataBody[1]);

  const docDefinition = {
    pageSize: "LEGAL",
    pageOrientation: "landscape",
    pageMargins: [10, 36, 10, 10],
    content: dataBody,
    defaultStyle: {
      font: "Sarabun",
    },
    styles: {
      header: {
        fontSize: 10,
        bold: true,
        alignment: "center",
      },
      title: {
        fontSize: 5,
        bold: false,
        alignment: "center",
        margin: [-5, 4, -5, 0],
      },
      textNoData: {
        alignment: "center",
        fontSize: 4,
        color: "white",
      },
      textAlign: {
        fontSize: 12,
        alignment: "left",
        // margin: [20, 0, 0, 0],
      },
      marginLeft: {
        margin: [20, 0, 0, 0],
      },
      marginSpacer: {
        margin: [0, 20, 0, 20],
      },
      fonSize10: {
        fontSize: 10,
      },
      fonSize8: {
        fontSize: 8,
      },
      fontSize7: {
        fontSize: 7,
      },
      fonSize6: {
        fontSize: 6,
      },
      fonSize4: {
        fontSize: 4,
      },
      dueCus: {
        fillColor: "#81C784",
        fontSize: 6,
        color: "black",
        alignment: "center",
        margin: [-3, 4, -3, 0],
      },
      dueSales: {
        fillColor: "#FFB74D",
        fontSize: 6,
        color: "black",
        alignment: "center",
        margin: [-3, 4, -3, 0],
      },
      FontColorGreen: {
        fontSize: 6,
        color: "green",
        bold: true,
        alignment: "center",
        // margin: [-3, 4, -3, 0],
      },
      FontColorRed: {
        fontSize: 6,
        color: "red",
        bold: true,
        alignment: "center",
      },
      FontColorOrange: {
        fontSize: 6,
        color: "orange",
        bold: true,
        alignment: "center",
      },
      fontLate: {
        fontSize: 6,
        color: "red",
        bold: true,
        alignment: "center",
        margin: [-5, 4, -5, 0],
      },
      bgColorHeaderPrintTable: {
        // fillColor: "#FAFAFA",
        fontSize: 6,
        color: "black",
        bold: true,
        alignment: "center",
        margin: [-3, 0, -3, 0],
      },
      HeaderProcess: {
        fontSize: 6,
        color: "black",
        bold: true,
        alignment: "center",
        margin: [-3, 4, -3, 0],
      },
      withoutInv: {
        fillColor: "#BDBDBD",
        fontSize: 6,
        color: "black",
        bold: true,
        alignment: "center",
        margin: [-3, 4, -3, 0],
      },
      normalInv: {
        fillColor: "#81C784",
        fontSize: 6,
        color: "black",
        bold: true,
        alignment: "center",
        margin: [-3, 4, -3, 0],
      },
      warningInv: {
        fillColor: "#FFB74D",
        fontSize: 6,
        color: "black",
        bold: true,
        alignment: "center",
        margin: [-3, 4, -3, 0],
      },
      lateInv: {
        fillColor: "#EF9A9A",
        fontSize: 6,
        color: "black",
        bold: true,
        alignment: "center",
        margin: [-3, 4, -3, 0],
      },
    },
  };
  await createPDF(docDefinition);
};

const printBillRepairFac = async (data) => {
  console.log("data : ", data);

  const repairDocNumber = textToBase64Barcode(data.repairDocNumber);
  const dataConvert = await convertImgMppPrint(data.ItemBill);
  console.log("dataConvert : ", dataConvert);
  const borderColorHeader = ["#808080", "#808080", "#808080", "#808080"];
  var rows = [];

  rows.push([
    {
      text: "NO.",
      alignment: "center",
      bold: true,
      style: "bgColorHeaderPrintTable",
      borderColor: borderColorHeader,
    },
    {
      text: "รายการสินค้า",
      alignment: "center",
      bold: true,
      style: "bgColorHeaderPrintTable",
      borderColor: borderColorHeader,
    },
    {
      text: "ส่งซ่อม",
      alignment: "center",
      bold: true,
      style: "bgColorHeaderPrintTable",
      borderColor: borderColorHeader,
    },
    {
      text: "อาการเสีย",
      alignment: "center",
      bold: true,
      style: "bgColorHeaderPrintTable",
      borderColor: borderColorHeader,
    },
    {
      text: "จำนวน",
      alignment: "center",
      bold: true,
      style: "bgColorHeaderPrintTable",
      borderColor: borderColorHeader,
    },
  ]);

  dataConvert.forEach((obj) => {
    // loop Reason
    obj.reason.forEach((dataReason) => {
      console.log(dataReason);
      rows.push([
        {
          text: obj.repair_Item,
          alignment: "center",
          style: "rowRecode",
          rowSpan: obj.reason.length,
          borderColor: borderColorHeader,
        },
        {
          stack: [
            { image: obj.PDFPict, width: 50 },
            { text: obj.ProductCode, bold: true, style: "fontSize9" },
          ],
          alignment: "center",
          rowSpan: obj.reason.length,
          borderColor: borderColorHeader,
          margin:
            obj.reason.length === 2
              ? [0, 0, 0, -20]
              : obj.reason.length === 1
              ? [0, 0, 0, 0]
              : [0, 0, 0, -40],
        },
        {
          text: obj.Qty,
          bold: true,
          alignment: "center",
          style: "rowRecode",
          rowSpan: obj.reason.length,
          borderColor: borderColorHeader,
          margin:
            obj.reason.length === 2
              ? [0, 0, 0, -20]
              : obj.reason.length === 1
              ? [0, 0, 0, 0]
              : [0, 0, 0, -40],
        },
        {
          text: dataReason.reasonType,
          alignment: "left",
          style: "fontSize9",
          borderColor: borderColorHeader,
          margin:
            obj.reason.length === 2
              ? [0, 0, 0, -20]
              : obj.reason.length === 1
              ? [0, 0, 0, 0]
              : [0, 0, 0, -40],
        },
        {
          text: dataReason.Qty,
          alignment: "center",
          style: "rowRecode",
          borderColor: borderColorHeader,
        },
      ]);
    });
  });

  const docDefinition = {
    pageSize: "A4",
    content: [
      {
        columns: [
          {
            text: "",
            width: 400,
            alignment: "center",
          },
          {
            image: repairDocNumber,
            width: 100,
            alignment: "right",
          },
        ],
        margin: [0, 0, 0, -15],
      },
      {
        text: "รายละเอียดบิลซ่อม",
        alignment: "center",
        fontSize: 18,
        margin: [0, 0, 0, -30],
        bold: true,
      },
      " ",
      " ",
      {
        columns: [
          {
            columns: [
              {
                text: [
                  "ผู้ส่งซ่อม : ",
                  { text: ` ${data.Sender ? data.Sender : ""}`, color: "gray" },
                ],
                width: 230,
                style: "fontSize10",
              },
              {
                text: "",
                width: 75,
              },
              {
                text: [
                  "OrderNumber : ",
                  { text: ` ${data.OrderNumber}  `, color: "gray" },
                ],
                width: 230,
                style: "fontSize10",
              },
            ],
          },
        ],
      },
      {
        columns: [
          {
            text: [
              "วันที่ส่งซ่อม : ",
              {
                text: ` ${
                  data.repairDate ? moment(data.repairDate).format("L") : ""
                }  `,
                color: "gray",
              },
              "เวลา : ",
              {
                text: `${
                  data.repairDate
                    ? moment(data.repairDate).format("LTS") + " น."
                    : ""
                }`,
                color: "gray",
              },
            ],
            width: 230,
            style: "fontSize10",
          },
          {
            text: "",
            width: 75,
          },
          {
            text: [
              "โอนจาก QA Team : ",
              {
                text: ` ${
                  store.state.FacToQa.filterQaBill.teamSales.customerShow
                    .filter(({ value }) => +value === data.cusStatus)
                    .map(({ name }) => name)[0]
                }  `,
                color: "gray",
              },
            ],
            width: 230,
            style: "fontSize10",
          },
        ],
      },
      {
        columns: [
          {
            text: [
              "เลขที่บิลซ่อม",
              { text: ` ${data.repairDocNumber}  `, color: "gray" },
            ],
            width: 230,
            style: "fontSize10",
          },
          {
            text: "",
            width: 75,
          },
          {
            text: [
              "โอนไป Factory :  ",
              { text: ` ${data.ProductionTeam}`, color: "gray" },
            ],
            width: 230,
            style: "fontSize10",
          },
        ],
      },
      {
        columns: [
          {
            text: [
              "เลขที่บิล : ",
              { text: ` ${data.qaDocNumber}  `, color: "gray" },
            ],
            width: 230,
            style: "fontSize10",
          },
          {
            text: "",
            width: 75,
          },
          {
            text: ["ผู้รับ : ", { text: `${data.Receiver}  `, color: "gray" }],
            width: 230,
            style: "fontSize10",
          },
        ],
      },
      {
        columns: [
          {
            text: "",
            width: 230,
            style: "fontSize10",
          },
          {
            text: "",
            width: 75,
          },
          {
            text: [
              "วันที่รับ : ",
              {
                text: ` ${
                  data.receiveDate ? moment(data.receiveDate).format("L") : ""
                }  `,
                color: "gray",
              },
              "เวลา : ",
              {
                text: `${
                  data.receiveDate
                    ? moment(data.receiveDate).format("LTS") + " น."
                    : ""
                }`,
                color: "gray",
              },
            ],
            width: 230,
            style: "fontSize10",
          },
        ],
      },
      " ",
      {
        width: "*",
        table: {
          dontBreakRows: true,
          widths: [30, 140, 30, 100, 100],
          body: rows,
          alignment: "center",
        },
      },
    ],
    defaultStyle: {
      font: "Sarabun",
    },
    styles: {
      header: {
        fontSize: 20,
        bold: true,
        alignment: "center",
        margin: [0, 10, 0, 0],
      },
      rowRecode: {
        fontSize: 12,
        bold: true,
        alignment: "center",
        //margin: [0, 14, 0, 0],
      },
      textHeader: {
        fontSize: 12,
        bold: true,
      },
      textGray: {
        fontSize: 11,
        color: "gray",
      },
      title: {
        fontSize: 14,
        bold: true,
        alignment: "left",
        margin: [0, 20, 0, 0],
      },
      textAlign: {
        fontSize: 12,
        alignment: "left",
        margin: [20, 0, 0, 0],
      },
      marginLeft: {
        margin: [20, 0, 0, 0],
      },
      fonSize10: {
        fontSize: 10,
      },
      fontSize9: {
        fontSize: 9,
      },
      fontSize8: {
        fontSize: 8,
      },
      bgColorHeaderPrintTable: {
        fillColor: "#C8E6C9",
        fontSize: 10,
        bold: true,
        alignment: "center",
      },
    },
  };
  await createPDF(docDefinition);
};

const printBillRepairFacSlip = async (data) => {
  const repairDocNumber = textToBase64Barcode(data.repairDocNumber);
  const dataConvert = await convertImgMppPrint(data.ItemBill);
  const borderColorHeader = ["#808080", "#808080", "#808080", "#808080"];
  var rows = [];

  rows.push([
    {
      text: "NO.",
      alignment: "center",
      bold: true,
      style: "bgColorHeaderPrintTable",
      borderColor: borderColorHeader,
    },
    {
      text: "รายการสินค้า",
      alignment: "center",
      bold: true,
      style: "bgColorHeaderPrintTable",
      borderColor: borderColorHeader,
    },
    {
      text: "ส่งซ่อม",
      alignment: "center",
      bold: true,
      style: "bgColorHeaderPrintTable",
      borderColor: borderColorHeader,
    },
    {
      text: "อาการเสีย",
      alignment: "center",
      bold: true,
      style: "bgColorHeaderPrintTable",
      borderColor: borderColorHeader,
    },
    {
      text: "จำนวน",
      alignment: "center",
      bold: true,
      style: "bgColorHeaderPrintTable",
      borderColor: borderColorHeader,
    },
  ]);

  dataConvert.forEach((obj) => {
    // loop Reason
    obj.reason.forEach((dataReason) => {
      rows.push([
        {
          text: obj.repair_Item,
          alignment: "center",
          style: "rowRecode",
          rowSpan: obj.reason.length,
          borderColor: borderColorHeader,
        },
        {
          stack: [
            { image: obj.PDFPict, width: 50, alignment: "center" },
            {
              text: obj.ProductCode,
              alignment: "center",
              fontSize: 8,
              bold: true,
            },
          ],
          rowSpan: obj.reason.length,
          borderColor: borderColorHeader,
          margin:
            obj.reason.length === 2
              ? [0, 0, 0, -20]
              : obj.reason.length === 1
              ? [0, 0, 0, 0]
              : [0, 0, 0, -30],
        },
        {
          text: obj.Qty,
          alignment: "center",
          style: "rowRecode",
          rowSpan: obj.reason.length,
          borderColor: borderColorHeader,
        },
        {
          text: dataReason.reasonType,
          alignment: "center",
          style: "rowRecode",
          borderColor: borderColorHeader,
        },
        {
          text: dataReason.Qty,
          alignment: "center",
          style: "rowRecode",
          borderColor: borderColorHeader,
        },
      ]);
    });
  });

  const docDefinition = {
    pageSize: {
      width: 300,
      height: "auto",
    },
    pageMargins: [10, 10, 10, 10],
    content: [
      {
        image: repairDocNumber,
        width: 220,
        alignment: "center",
      },

      {
        text: "บิลซ่อม FAC",
        alignment: "center",
        fontSize: 14,
        bold: true,
      },

      " ",
      {
        text: `เลขที่บิลซ่อม : ${data.repairDocNumber}`,
        style: "textHeader",
      },
      {
        text: `OrderNumber : ${data.OrderNumber}`,
        style: "textHeader",
      },
      {
        text: `โอนจาก QA Team : ${
          store.state.FacToQa.filterQaBill.teamSales.customerShow
            .filter(({ value }) => +value === data.cusStatus)
            .map(({ name }) => name)[0]
        }`,
        style: "textHeader",
      },
      {
        text: `โอนไป FACTORY : ${data.ProductionTeam}`,
        style: "textHeader",
      },
      {
        text: `ผู้ส่งซ่อม : ${data.Sender ? data.Sender : ""}`,
        style: "textHeader",
      },
      {
        text: `วันที่ส่งซ่อม : ${
          data.repairDate ? moment(data.repairDate).format("L") : ""
        } เวลา : ${
          data.repairDate ? moment(data.repairDate).format("LTS") + " น." : ""
        }`,
        style: "textHeader",
      },
      {
        text: `วันที่รับ : ${
          data.receiveDate ? moment(data.receiveDate).format("L") : ""
        } เวลา : ${
          data.receiveDate ? moment(data.receiveDate).format("LTS") + " น." : ""
        }`,
        style: "textHeader",
      },

      " ",
      {
        width: "*",
        table: {
          dontBreakRows: true,
          widths: [20, 90, 30, 60, 30],
          body: rows,
          alignment: "center",
        },
      },
    ],
    defaultStyle: {
      font: "Sarabun",
    },
    styles: {
      header: {
        fontSize: 20,
        bold: true,
        alignment: "center",
        margin: [0, 10, 0, 0],
      },
      rowRecode: {
        fontSize: 11,
        bold: true,
        alignment: "center",
      },
      textHeader: {
        fontSize: 12,
        bold: true,
      },
      textGray: {
        fontSize: 11,
        color: "gray",
      },
      title: {
        fontSize: 14,
        bold: true,
        alignment: "left",
        margin: [0, 20, 0, 0],
      },
      textAlign: {
        fontSize: 12,
        alignment: "left",
        margin: [20, 0, 0, 0],
      },
      marginLeft: {
        margin: [20, 0, 0, 0],
      },
      fonSize10: {
        fontSize: 10,
      },
      fonSize8: {
        fontSize: 8,
      },
      bgColorHeaderPrintTable: {
        fillColor: "#C8E6C9",
        fontSize: 10,
        bold: true,
        alignment: "center",
      },
    },
  };
  await createPDF(docDefinition);
};

const printBillQa = async (data) => {
  const barcodeBill = textToBase64Barcode(data.qaDocNumber);
  const dataConvert = await convertImgMppPrint(data.ItemBill);
  const borderColorHeader = ["#808080", "#808080", "#808080", "#808080"];
  let rows = [];
  console.log(data);
  rows.push([
    {
      text: "No.",
      alignment: "center",
      bold: true,
      style: "bgColorHeaderPrintTable",
      borderColor: borderColorHeader,
    },
    {
      text: "รายการสินค้า",
      alignment: "center",
      bold: true,
      style: "bgColorHeaderPrintTable",
      borderColor: borderColorHeader,
    },
    {
      text: "รหัสสินค้า / ผู้ตรวจงาน (Fac) / Code ",
      alignment: "center",
      bold: true,
      style: "bgColorHeaderPrintTable",
      borderColor: borderColorHeader,
    },
    {
      text: "จำนวนที่ส่ง",
      alignment: "center",
      bold: true,
      style: "bgColorHeaderPrintTable",
      borderColor: borderColorHeader,
    },
  ]);

  dataConvert.forEach((dataItemDetail) => {
    rows.push([
      {
        text: dataItemDetail.bill_Item,
        alignment: "center",
        style: "rowRecode",
        borderColor: borderColorHeader,
      },
      {
        stack: [
          {
            text: dataItemDetail.OrderItemNo,
            fontSize: 8,
            color: "gray",
            margin: [0, 0, 0, -10],
          },
          { image: dataItemDetail.PDFPict, width: 45, alignment: "center" },
          //{ text: dataItemDetail.ProductCode, alignment: "center", fontSize: 10 },
        ],
        //fillColor: "#C8E6C9",
        borderColor: borderColorHeader,
      },
      {
        stack: [
          { text: dataItemDetail.ProductCode, bold: true },
          {
            text: [
              { text: "ผู้ตรวจ : ", bold: true },
              {
                text: `${
                  dataItemDetail.QCPerson ? dataItemDetail.QCPerson : ""
                }`,
                color: "gray",
              },
            ],
          },
          {
            text: [
              { text: "Code : ", bold: true },
              { text: dataItemDetail.qaJobNumber, color: "gray" },
            ],
          },
        ],

        style: "fontSize8",
        borderColor: borderColorHeader,
      },
      {
        text: dataItemDetail.QtyItem,
        alignment: "center",
        style: "rowRecode",
        borderColor: borderColorHeader,
      },
    ]);
  });

  const docDefinition = {
    pageSize: "A4",
    content: [
      {
        columns: [
          {
            text: "",
            width: 400,
            alignment: "center",
          },
          {
            image: barcodeBill,
            width: 100,
            alignment: "right",
          },
        ],
        margin: [0, 0, 0, -15],
      },
      {
        text: "บิลโอนงานผลิตส่ง QA",
        alignment: "center",
        fontSize: 18,
        margin: [0, 0, 0, -30],
        bold: true,
      },
      " ",
      " ",
      {
        columns: [
          {
            text: [
              "เลขที่บิล : ",
              { text: ` ${data.qaDocNumber}  `, color: "gray" },
            ],
            width: 230,
            style: "fontSize10",
          },
          {
            text: "",
            width: 75,
          },
          {
            text: [
              "OrderNumber : ",
              { text: ` ${data.OrderNumber}  `, color: "gray" },
            ],
            width: 230,
            style: "fontSize10",
          },
        ],
      },
      {
        columns: [
          {
            text: [
              "ผู้ส่งบิล : ",
              { text: ` ${data.Sender ? data.Sender : ""}  `, color: "gray" },
            ],
            width: 230,
            style: "fontSize10",
          },
          {
            text: "",
            width: 75,
          },
          {
            text: [
              "โอนจาก : ",
              { text: `Factory ${data.ProductionTeam}  `, color: "gray" },
            ],
            width: 230,
            style: "fontSize10",
          },
        ],
      },
      {
        columns: [
          {
            text: [
              "วันที่เปิดบิล : ",
              {
                text: ` ${moment(data.billDate).format("L")}  `,
                color: "gray",
              },
              "เวลา : ",
              {
                text: `${moment(data.billDate).format("LTS")} น.  `,
                color: "gray",
              },
            ],
            width: 230,
            style: "fontSize10",
          },
          {
            text: "",
            width: 75,
          },
          {
            text: [
              "ผู้รับ : ",
              {
                text: ` ${data.Receiver ? data.Receiver : ""}  `,
                color: "gray",
              },
            ],
            width: 230,
            style: "fontSize10",
          },
        ],
      },
      {
        columns: [
          {
            text: ``,
            width: 230,
          },
          {
            text: "",
            width: 75,
          },
          {
            text: [
              "วันที่รับ : ",
              {
                text: ` ${
                  data.receiveDate ? moment(data.receiveDate).format("L") : ""
                }  `,
                color: "gray",
              },
              "เวลา : ",
              {
                text: `${
                  data.receiveDate
                    ? moment(data.receiveDate).format("LTS") + " น."
                    : ""
                }  `,
                color: "gray",
              },
            ],
            style: "fontSize10",
          },
        ],
      },
      " ",
      {
        width: "*",
        table: {
          dontBreakRows: true,
          widths: [35, 75, 215, 125],
          body: rows,
        },
      },
    ],
    defaultStyle: {
      font: "Sarabun",
    },
    styles: {
      header: {
        fontSize: 20,
        bold: true,
        alignment: "center",
        margin: [0, 10, 0, 0],
      },
      rowRecode: {
        fontSize: 12,
        alignment: "center",
        margin: [0, 9, 0, 0],
      },
      title: {
        fontSize: 14,
        bold: true,
        alignment: "left",
        margin: [0, 20, 0, 0],
      },
      textAlign: {
        fontSize: 12,
        alignment: "left",
        margin: [20, 0, 0, 0],
      },
      marginLeft: {
        margin: [20, 0, 0, 0],
      },
      fontSize10: {
        fontSize: 10,
      },
      fontSize8: {
        fontSize: 8,
      },
      bgColorHeaderPrintTable: {
        fillColor: "#C8E6C9",
        fontSize: 10,
        bold: true,
        alignment: "center",
      },
    },
  };
  await createPDF(docDefinition);
};

const getWidhtCol = (length) => {
  let widthCol = [];
  for (let i = 0; i < length; i++) {
    if (i < 4 && i !== 3) {
      widthCol.push(18);
    } else if (i === 3) {
      widthCol.push(12);
    } else if (i > 4 && i < 19) {
      widthCol.push(12);
    } else if (i === 19) {
      widthCol.push(18);
    } else if (i > 19) {
      widthCol.push(10);
    }
  }
  return widthCol;
};

const convertDate_JS_TO_SQL = (date) => {
  const valueDate = `${moment(date).format("YYYY")}-${moment(date).format(
    "MM"
  )}-${moment(date).format("DD")}`;
  return valueDate;
};

const printFacToQaBillSlip = async (dataBill) => {
  const dataConvert = await convertDataFacToQaPrint(dataBill.ItemBill);
  console.log("dataBill : ", dataBill);
  console.log("Service, BackendReturn", dataConvert);

  const borderColorHeader = ["#000000", "#000000", "#000000", "#000000"];

  let content = [];
  dataConvert.forEach((obj) => {
    const dataContent = [
      // row 1
      [
        {
          text: "บิลโอน FAC ไป QA",
          alignment: "center",
          //style: "headerPrintTable",
          fontSize: 13,
          bold: true,
          borderColor: borderColorHeader,
          margin: [0, 5, 0, 0],
        },
        {
          stack: [
            {
              text: "วันที่ส่ง",
              alignment: "left",
              margin: [0, -5, 0, 0],
            },
            {
              text: `${moment(dataBill.billDate).format("dd")} ${moment(
                dataBill.billDate
              ).format("L")}`,
              alignment: "center",
              bold: true,
            },
          ],
          style: "fontSize10",
          margin: [-3, 5, -3, 0],
          alignment: "center",
          borderColor: borderColorHeader,
        },
        {
          text: `Factory ${dataBill.ProductionTeam}`,
          style: "headerPrintTable",
          alignment: "center",
          borderColor: borderColorHeader,
          margin: [0, 5, 0, 0],
          colSpan: 2,
        },
        {},
      ],

      // row 2
      [
        {
          stack: [
            {
              text: "ORDER NO :",
              alignment: "left",
            },
            {
              text: `${dataBill.OrderNumber}`,
              alignment: "center",
            },
          ],
          style: "fontSize13",
          bold: true,
          alignment: "center",
          borderColor: borderColorHeader,
          colSpan: 4,
        },
      ],

      // row 3
      [
        {
          image: obj.PDFPict,
          width: 130,
          //fillColor: "#E7FBBE",
          alignment: "center",
          borderColor: borderColorHeader,
          colSpan: 2,
          rowSpan: 3,
        },
        {},
        {
          image: obj.qrCode,
          //fillColor: "#E7FBBE",
          width: 60,
          height: 60,
          alignment: "center",
          colSpan: 2,
          margin: [0, -1, 0, -7],
          // margin : obj.qaJobNumber.trim() !== "" ? [0, -1, 0, -7] : [0, -1, 0 ,-7]
        },
        {},
      ],

      // row 4
      [
        {},
        {},
        {
          text: `ผู้ส่ง  : ${dataBill.Sender}`,
          colSpan: 2,
          fontSize: 9,
          bold: true,
        },
        {},
      ],
      // row 5
      [
        {},
        {},
        {
          text: `ผู้QC : ${obj.QCPerson ? obj.QCPerson : ""}`,
          colSpan: 2,
          fontSize: 9,
          bold: true,
        },
        {},
      ],
      // row 6
      [
        {
          stack: [
            {
              text: "CODE",
              alignment: "left",
              style: "fontSizeStack",
            },
            {
              text: obj.ProductCode,
              alignment: "center",
              fontSize: 13,
              margin: [0, -5, 0, 0],
              //style: "headerPrintTable",
            },
          ],
          alignment: "center",
          borderColor: borderColorHeader,
          colSpan: 4,
        },
      ],

      // row 7
      [
        { text: "จำนวนที่โอน : " },
        {
          text: obj.QtyItem,
          alignment: "center",
          style: "headerPrintTable",
          margin: [0, -3, 0, 0],
        },
        { text: "ผ่าน : ", alignment: "center" },
        {},
      ],

      // row 8
      [
        { text: `QA : ${obj.QAPerson ? obj.QAPerson : ""}`, colSpan: 2 },
        {},
        { text: "ไม่ผ่าน : ", alignment: "center" },
        {},
      ],

      // row 9
      [
        { text: "อาการ", alignment: "center", colSpan: 2, style: "fontSize13" },
        {},
        { text: "จำนวน", alignment: "center", colSpan: 2, style: "fontSize13" },
        {},
      ],

      // row 10
      [
        { text: "1.", alignment: "left", colSpan: 2, margin: [0, 8, 0, 8] },
        {},
        { text: "", colSpan: 2 },
        {},
      ],

      // row 11
      [
        { text: "2.", alignment: "left", colSpan: 2, margin: [0, 8, 0, 8] },
        {},
        { text: "", colSpan: 2 },
        {},
      ],

      // row 12
      [
        { text: "3.", alignment: "left", colSpan: 2, margin: [0, 8, 0, 8] },
        {},
        { text: "", colSpan: 2 },
        {},
      ],

      //row 13
      [
        { text: "4.", alignment: "left", colSpan: 2, margin: [0, 8, 0, 8] },
        {},
        { text: "", colSpan: 2 },
        {},
      ],
    ];
    content.push({ text: " ", style: "" });
    content.push({
      table: {
        widths: [100, 70, 50, "*"],
        body: dataContent,
      },
    });
  });
  const docDefinition = {
    pageSize: {
      width: 300,
      height: 423,
    },
    pageOrientation: "portrait",
    pageMargins: [0, 0, 2, 0],
    content: content,
    defaultStyle: {
      font: "Sarabun",
    },
    styles: {
      headerPrintTable: {
        fontSize: 14,
        bold: true,
      },
      fontSizeStack: {
        fontSize: 9,
        bold: true,
      },
      fontSize8: {
        fontSize: 8,
      },
      fontSize10: {
        fontSize: 10,
      },
      fontSize13: {
        fontSize: 13,
        bold: true,
      },
    },
  };
  await createPDF(docDefinition);
};

const convertDataFacToQaPrint = async (data) => {
  const result = await axios.post(
    "http://192.168.3.5:3000/convertDataFactoQaPrint",
    data
  );
  return result.data;
};

const printReportRepairByOrder = async (data, orderNumber) => {
  const dataConvert = await convertImgMppPrint(data);
  var rows = [];

  rows.push([
    {
      text: "NO.",
      rowSpan: 2,
      alignment: "center",
      bold: true,
      style: "bgColorHeaderPrintTable",
    },
    {
      text: "รายการ",
      rowSpan: 2,
      alignment: "center",
      bold: true,
      style: "bgColorHeaderPrintTable",
    },
    {
      text: "จำนวนเต็ม",
      rowSpan: 2,
      alignment: "center",
      bold: true,
      style: "bgColorHeaderPrintTable",
    },
    {
      text: "รายละเอียดส่งซ่อม",
      colSpan: 3,
      alignment: "center",
      bold: true,
      style: "bgColorHeaderPrintTable",
    },
    {},
    {},
    {
      text: "รวมซ่อม",
      rowSpan: 2,
      alignment: "center",
      bold: true,
      style: "bgColorHeaderPrintTable",
    },
  ]);

  rows.push([
    {},
    {},
    {},
    {
      text: "แผนก",
      alignment: "center",
      bold: true,
      style: "bgColorHeaderPrintTable",
    },
    {
      text: "อาการเสีย",
      alignment: "center",
      bold: true,
      style: "bgColorHeaderPrintTable",
    },
    {
      text: "จำนวน",
      alignment: "center",
      bold: true,
      style: "bgColorHeaderPrintTable",
    },
    {},
  ]);

  dataConvert.forEach((obj) => {
    obj.reason.forEach((dataReason) => {
      rows.push([
        {
          text: obj.OrderItemNo,
          alignment: "center",
          rowSpan: obj.reason.length,
        },
        {
          stack: [
            {
              image: obj.PDFPict,
              width: 50,
              margin: obj.reason.length,
            },
            {
              text: obj.ProductCode,
              alignment: "center",
              fontSize: 7,
            },
          ],
          alignment: "center",
          rowSpan: obj.reason.length,
          margin:
            obj.reason.length === 2
              ? [0, 0, 0, -15]
              : obj.reason.length === 1
              ? [0, 0, 0, 0]
              : [0, 0, 0, -80],
        },
        {
          text: obj.TotalQty,
          alignment: "center",
          rowSpan: obj.reason.length,
          margin:
            obj.reason.length === 2
              ? [0, 0, 0, -15]
              : obj.reason.length === 1
              ? [0, 0, 0, 0]
              : [0, 0, 0, -80],
        },
        {
          text: dataReason.repairType,
          alignment: "left",
          style: "fontSize9",
        },
        {
          text: dataReason.reasonType,
          alignment: "left",
          style: "fontSize9",
        },
        {
          text: dataReason.Qty,
          alignment: "center",
          style: "fontSize9",
        },
        {
          stack: [
            {
              text: obj.SumRepair,
              alignment: "center",
              rowSpan: obj.reason.length,
            },
            {
              text:
                `( ` + (100 / (obj.TotalQty / obj.SumRepair)).toFixed() + "% )",
              alignment: "center",
              fontSize: 8,
              color: "gray",
            },
          ],
          rowSpan: obj.reason.length,
          margin:
            obj.reason.length === 2
              ? [0, 0, 0, -15]
              : obj.reason.length === 1
              ? [0, 0, 0, 0]
              : [0, 0, 0, -80],
        },
      ]);
    });
  });
  const docDefinition = {
    pageSize: "A4",
    content: [
      {
        columns: [
          {
            text: "",
            width: 400,
            alignment: "center",
          },
        ],
        margin: [0, 0, 0, -15],
      },
      {
        text: [
          { text: "สรุป QA ส่งซ่อมของ ORDER : " },
          { text: `${orderNumber}`, color: "gray" },
        ],
        alignment: "center",
        fontSize: 18,
        margin: [0, 0, 0, -30],
        bold: true,
      },
      " ",
      " ",
      " ",
      {
        width: "*",
        table: {
          dontBreakRows: true,
          widths: [30, 100, 50, 60, 100, 50, 50],
          body: rows,
          alignment: "center",
        },
      },
    ],
    defaultStyle: {
      font: "Sarabun",
    },
    styles: {
      header: {
        fontSize: 20,
        bold: true,
        alignment: "center",
        margin: [0, 10, 0, 0],
      },
      rowRecode: {
        fontSize: 12,
        bold: true,
        alignment: "center",
        //margin: [0, 14, 0, 0],
      },
      textHeader: {
        fontSize: 12,
        bold: true,
      },
      textGray: {
        fontSize: 11,
        color: "gray",
      },
      title: {
        fontSize: 14,
        bold: true,
        alignment: "left",
        margin: [0, 20, 0, 0],
      },
      textAlign: {
        fontSize: 12,
        alignment: "left",
        margin: [20, 0, 0, 0],
      },
      marginLeft: {
        margin: [20, 0, 0, 0],
      },
      fonSize10: {
        fontSize: 10,
      },
      fontSize9: {
        fontSize: 9,
      },
      fontSize8: {
        fontSize: 8,
      },
      bgColorHeaderPrintTable: {
        fillColor: "#C8E6C9",
        fontSize: 10,
        bold: true,
        alignment: "center",
      },
    },
  };
  await createPDF(docDefinition);
};

const printReportFactoQa = async (dateBetween, data) => {
  var rows = [];
  rows.push([
    {
      text: "วันที่ส่ง",
      alignment: "center",
      style: "header",
    },
    {
      text: "ORDER NO",
      alignment: "center",
      style: "header",
    },
    {
      text: "จน.ทั้ง ORDER",
      alignment: "center",
      style: "header",
    },
    {
      text: "จน.ที่ FACส่งQA",
      alignment: "center",
      style: "header",
    },
    {
      text: "จน.ที่ QA ตรวจ",
      alignment: "center",
      style: "header",
    },
    {
      text: "จน.QAส่งซ่อม",
      alignment: "center",
      style: "header",
    },
  ]);

  data.forEach((obj) => {
    rows.push([
      {
        text: `${moment(obj.jobDate).format("dd")} ${moment(obj.jobDate).format(
          "L"
        )}`,
        style: "rowRecode",
      },
      {
        stack: [
          {
            text: obj.OrderNumber,
            bold: true,
            style: "rowRecode",
          },
          {
            text: `Factory:${obj.ProductionTeam}`,
            alignment: "center",
            fontSize: 10,
            color: "gray",
          },
        ],
      },
      {
        text: obj.TotalQty.toLocaleString(),
        style: "rowRecode",
      },
      {
        stack: [
          {
            text: obj.billQty.toLocaleString(),
            style: "rowRecode",
          },
          {
            text: ((obj.billQty * 100) / obj.TotalQty).toFixed(2) + " %",
            style: "textGray",
          },
        ],
      },
      {
        stack: [
          {
            text: obj.finishQty.toLocaleString(),
            style: "rowRecode",
          },
          {
            text: ((obj.finishQty * 100) / obj.TotalQty).toFixed(2) + " %",
            style: "textGray",
          },
        ],
      },
      {
        stack: [
          {
            text: obj.repairQty,
            style: "rowRecode",
          },
          {
            text: ((obj.repairQty * 100) / obj.TotalQty).toFixed(2) + " %",
            style: "textGray",
          },
        ],
      },
    ]);
  });

  const docDefinition = {
    pageSize: "A4",
    content: [
      {
        text: "รายงานสถานะ QA",
        fontSize: 17,
        alignment: "center",
      },
      {
        //const minDate = this.$moment(new Date(this.dataTable.dataFilter.dateBetween.valuesDate[0])).format('L')
        text:
          dateBetween[0] !== dateBetween[1]
            ? `( ตั้งเเต่วัน ${moment(dateBetween[0]).format("dd")} ${moment(
                dateBetween[0]
              ).format("L")} ถึงวัน ${moment(dateBetween[1]).format(
                "dd"
              )} ${moment(dateBetween[1]).format("L")} )`
            : `( วัน ${moment(dateBetween[0]).format("dd")} ${moment(
                dateBetween[0]
              ).format("L")} )`,
        style: "title",
      },
      " ",
      {
        width: "*",
        table: {
          dontBreakRows: true,
          widths: [75, 115, 70, 70, 80, 65],
          body: rows,
        },
      },
    ],
    defaultStyle: {
      font: "Sarabun",
    },
    styles: {
      header: {
        fontSize: 11,
        bold: true,
        alignment: "center",
        fillColor: "#40DFEF",
      },
      rowRecode: {
        fontSize: 10,
        alignment: "center",
      },
      title: {
        fontSize: 14,
        color: "gray",
        bold: true,
        alignment: "center",
      },
      textGray: {
        fontSize: 10,
        color: "gray",
        alignment: "center",
      },
      textAlign: {
        fontSize: 12,
        alignment: "left",
        margin: [20, 0, 0, 0],
      },
      marginLeft: {
        margin: [20, 0, 0, 0],
      },
      fontSize10: {
        fontSize: 10,
      },
      fontSize8: {
        fontSize: 8,
      },
      bgColorHeaderPrintTable: {
        fillColor: "#C8E6C9",
        fontSize: 10,
        bold: true,
        alignment: "center",
      },
    },
  };
  await createPDF(docDefinition);
};
const printReportFactoQa_Detail = async (dataMaster, dataDetail, isItemNoForFac) => {
  const dataItem = dataDetail
  dataItem.forEach((obj, index) => {
    //let maxRows = [obj.facSend.length, obj.qaPass.length, obj.qaRepair.length]
    if(obj.facSend.length < obj.countRow ){
      for(let i = obj.facSend.length; i < obj.countRow; i++){
        dataItem[index].facSend.push({
          OrderItemNo: '',
          QCPerson: '',
          QtyFac: ''
        })
      }
    }
    if(obj.qaPass.length < obj.countRow){
      for(let j = obj.qaPass.length; j < obj.countRow; j++){
        dataItem[index].qaPass.push({
          OrderItemNo: '',
          QAPerson: '',
          QtyFinish: ''
        })
      }
    }
    if(obj.qaRepair.length < obj.countRow ){
      for(let k = obj.qaRepair.length; k < obj.countRow; k++){
        dataItem[index].qaRepair.push({
          OrderItemNo: '',
          TotalRepair: '',
          reasonType: '',
          repairType: ''
        })
      }
    }
  })
  const dataConvert = await convertImgMppPrint(dataItem);
  //console.log(dataMaster);
  //console.log(dataConvert);
  let heightsRowSpan = [10, 10, 10];
  var rows = [];
  rows.push(
    [
      {
        text: "NO.",
        rowSpan: 2,
        style: "header",
        margin: [0, 12, 0, 0],
      },
      {
        text: "รายละเอียดสินค้า",
        rowSpan: 2,
        style: "header",
        margin: [0, 12, 0, 0],
      },
      {
        text: "จำนวนเต็ม",
        rowSpan: 2,
        style: "header",
        margin: [0, 12, 0, 0],
      },
      {
        text: "จน.ฝ่ายผลิตส่ง QA",
        colSpan: 2,
        style: "headerColor1",
      },
      {},
      {
        text: "จำนวน QA ตรวจผ่าน",
        colSpan: 2,
        style: "headerColor2",
      },
      {},
      {
        text: "จำนวน QA ส่งซ่อม",
        colSpan: 3,
        style: "headerColor3",
      },
      {},
      {},
    ],
    [
      {},
      {},
      {},
      { text: "ผู้ตรวจ(QC)", style: "headerColor1" },
      {
        text: "จน.ที่ส่ง",
        style: "headerColor1",
      },
      { text: "ผู้ตรวจ(QC)", style: "headerColor2" },
      {
        text: "จน.ผ่าน",
        style: "headerColor2",
      },
      {
        text: "แผนก",
        style: "headerColor3",
      },
      {
        text: "อาการ",
        style: "headerColor3",
      },
      { text: "จน.ซ่อม", style: "headerColor3" },
    ],
    [
      { text: "ผลรวม", style: "headerColor4", color: "blue", colSpan: 2 },
      { text: "", style: "headerColor4" },
      { text: dataMaster.TotalQty.toLocaleString(), style: "headerColor4" },
      { text: "", style: "headerColor4" },
      {
        text: dataMaster.billQty.toLocaleString(),
        style: "headerColor4",
        color: "#0099ff",
      },
      { text: "", style: "headerColor4" },
      {
        text: dataMaster.finishQty.toLocaleString(),
        style: "headerColor4",
        color: "#336600",
      },
      { text: "", style: "headerColor4" },
      { text: "", style: "headerColor4" },
      {
        text: dataMaster.repairQty.toLocaleString(),
        style: "headerColor4",
        color: "#ff9900",
      },
    ]
  );

  dataConvert.forEach((obj) => {
    for (let c = 0; c < obj.countRow; c++) {
      heightsRowSpan.push(
        obj.countRow > 1 ? (c === obj.countRow - 1 ? 1 : 20) : 60
      );
    }

    obj.facSend.forEach((data, index) => {
      rows.push([
        // NO.
        {
          text: isItemNoForFac === true ? obj.ItemNoForFac : obj.ItemNo,
          style: "rowRecode",
          rowSpan: obj.facSend.length,
        },

        // image
        {
          stack: [
            {
              image: obj.PDFPict,
              width: 45,
              alignment: "center",
            },
            {
              text: obj.ProductCode,
              style: "rowRecode",
            },
          ],
          rowSpan: obj.facSend.length,
          // margin: obj.facSend.length > 1 ? [0, 0, 0, 0] : [0, 0, 0, 0],
        },

        // Total Qty
        {
          text: obj.Qty,
          style: "rowRecode",
          rowSpan: obj.facSend.length,
        },

        // QC FAC
        {
          text: obj.facSend[index].QCPerson,
          style: obj.facSend[index].QCPerson ? "qcFac" : "rowRecode",
        },
        {
          text: obj.facSend[index].QtyFac,
          style: obj.facSend[index].QCPerson ? "qcFac" : "rowRecode",
        },

        // QC QA
        {
          text: obj.qaPass[index].QAPerson,
          style: obj.qaPass[index].QAPerson ? "qcQa" : "rowRecode",
          margin: obj.qaPass.length === 1 ? [0, 3, 0, 0] : [0, 1, 0, 0],
        },
        {
          text: obj.qaPass[index].QtyFinish,
          style: obj.qaPass[index].QAPerson ? "qcQa" : "rowRecode",
        },

        // Repair Detail
        {
          text: obj.qaRepair[index].repairType,
          style: obj.qaRepair[index].repairType ? "repairDetail" : "rowRecode",
        },
        {
          text: obj.qaRepair[index].reasonType,
          style: obj.qaRepair[index].repairType ? "repairDetail" : "rowRecode",
        },
        {
          text: obj.qaRepair[index].TotalRepair,
          style: obj.qaRepair[index].repairType ? "repairDetail" : "rowRecode",
        },
      ]);
    });
  });
  //console.log(heightsRowSpan);
  const docDefinition = {
    pageSize: "A4",
    content: [
      {
        text: "รายงานสถานะ QA",
        fontSize: 17,
        alignment: "center",
      },
      {
        columns: [
          {
            text: [
              "สถานะงานวันที่ : ",
              {
                text: ` (${moment(dataMaster.jobDate).format("dd")}) ${moment(
                  dataMaster.jobDate
                ).format("L")}`,
                color: "gray",
              },
            ],
            width: 230,
            style: "master",
          },

          " ",
          {
            text: [
              "Factory : ",
              {
                text: `${dataMaster.ProductionTeam}`,
                color: "gray",
              },
            ],
            width: 160,
            style: "master",
          },
        ],
      },

      {
        columns: [
          {
            text: [
              "ORDER NO : ",
              {
                text: `${dataMaster.OrderNumber}`,
                color: "gray",
              },
            ],
            width: 230,
            style: "master",
          },
          " ",
          {
            text: [
              "QA TEAM : ",
              {
                text: `${
                  store.state.FacToQa.filterQaBill.teamSales.customerShow
                    .filter(({ value }) => +value === dataMaster.SalesTeam)
                    .map(({ name }) => name)[0]
                }`,
                color: "gray",
              },
            ],
            width: 160,
            style: "master",
          },
        ],
      },
      " ",
      {
        width: "*",
        table: {
          dontBreakRows: true,
          widths: [30, 100, 50, 40, 40, 40, 40, 35, 35, 30],
          heights: heightsRowSpan,
          body: rows,
        },
      },
    ],
    defaultStyle: {
      font: "Sarabun",
    },
    styles: {
      master: {
        fontSize: 11,
        bold: true,
      },
      header: {
        fontSize: 8,
        bold: true,
        alignment: "center",
      },
      headerColor1: {
        fontSize: 8,
        bold: true,
        alignment: "center",
        fillColor: "#ccffff",
      },
      headerColor3: {
        fontSize: 8,
        bold: true,
        alignment: "center",
        fillColor: "#FFFACD",
      },
      headerColor2: {
        fontSize: 8,
        bold: true,
        alignment: "center",
        fillColor: "#b3ffe6",
      },
      headerColor4: {
        fontSize: 8,
        bold: true,
        alignment: "center",
        fillColor: "#e6e6e6",
      },

      rowRecode: {
        fontSize: 8,
        alignment: "center",
        margin: [0, 12, 0, 0],
      },
      qcFac: {
        fontSize: 8,
        alignment: "center",
        margin: [0, 6, 0, 0],
        fillColor: "#ccffff",
      },
      qcQa: {
        fontSize: 8,
        alignment: "center",
        margin: [0, 6, 0, 0],
        fillColor: "#b3ffe6",
      },
      repairDetail: {
        fontSize: 8,
        alignment: "center",
        margin: [0, 6, 0, 0],
        fillColor: "#FFFACD",
      },
      title: {
        fontSize: 13,
        color: "gray",
        bold: true,
      },
      textGray: {
        fontSize: 10,
        color: "gray",
        alignment: "center",
      },
    },
  };

  await createPDF(docDefinition);
};

export default {
  createPDF,
  convertImg,
  convertImgMppPrint,
  printBillMaterial,
  textToBase64Barcode,
  printReportRepairDoc,
  testInsertImg,
  testNewprint,
  printCastingByOrder,
  printCastingByItem,
  printSlip,
  printFacWipStatus,
  convertDate_JS_TO_SQL,
  printBillRepairFac,
  printBillRepairFacSlip,
  printBillQa,
  printFacToQaBillSlip,
  printReportRepairByOrder,
  printReportFactoQa,
  testUploadImg,
  uploadImgEmp,
  printRepairDoc,
  printReportFactoQa_Detail,
};
