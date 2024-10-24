var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const multer = require('multer');
const fetch = require('node-fetch');
const axios = require('axios');

const xlsx = require('xlsx');

var indexRouter = require('./routes/index');
var resultForSearchByIdRouter = require('./routes/resultForSearchById');
var resultForSearchByListRouter = require('./routes/resultForSearchByList');
var resultForSearchByAddRouter = require('./routes/resultForSearchByAdd');
var testpageRouter = require('./routes/testpage');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Giả lập dữ liệu

const city = [
  { value: 29, name: 'Hà Nội' },
  { value: 29, name: 'Hà Nam' },
  { value: 35, name: 'Hưng Yên' },
  { value: 35, name: 'Nam Định' },
  { value: 35, name: 'Ninh Bình' },
  { value: 35, name: 'Thanh Hóa' },
  { value: 35, name: 'Quảng Ninh' },
];

const district = [
  { value: 'DA', name: 'Văn Lâm' },
  { value: 'SS', name: 'Văn Giang' },
  { value: 'DA', name: 'Ân Thi' },
  { value: 'SS', name: 'Mỹ Hào' },
  { value: 'DA', name: 'Tiên Lữ' },
  { value: 'SS', name: 'Khoái Châu' },
];

const ward = [
  { value: 'DT', name: 'Chỉ Đạo' },
  { value: 'CL', name: 'Đại Đồng' },
  { value: 'DT', name: 'Tân Quang' },
  { value: 'CL', name: 'Trưng Trắc' },
  { value: 'DT', name: 'Việt Hưng' },
  { value: 'CL', name: 'TT Văn Giang' }
];

const resultSearchByAddScreen = [
  {"citizen_id":822810730815,"name": "Nguyễn Văn Quyết","age": 17,"address": "TT Văn Giang, Văn Giang, Hưng Yên" , "result": "Nguy cơ cao" },
  {"citizen_id":230832268319,"name": "Hồ Văn Cường","age": 20,"address": "TT Văn Giang, Văn Giang, Hưng Yên" , "result": "Nguy cơ cao" },
  {"citizen_id":814530015636,"name": "Đặng Văn Lâm","age": 22,"address": "TT Văn Giang, Văn Giang, Hưng Yên" , "result": "Nguy cơ cao" },
  {"citizen_id":567971098209,"name": "Nguyễn Quang Hải","age": 16,"address": "TT Văn Giang, Văn Giang, Hưng Yên" , "result": "Nguy cơ cao" },
  {"citizen_id":302430915447,"name": "Nguyễn Công Phượng","age": 13,"address": "TT Văn Giang, Văn Giang, Hưng Yên" , "result": "Nguy cơ cao" },
  {"citizen_id":707997446845,"name": "Nguyễn Hoàng Đức","age": 23,"address": "TT Văn Giang, Văn Giang, Hưng Yên" , "result": "Nguy cơ cao" },
  {"citizen_id":673359564378,"name": "Bùi Tiến Dũng","age": 25,"address": "TT Văn Giang, Văn Giang, Hưng Yên" , "result": "Nguy cơ cao" },
  {"citizen_id":708195045557,"name": "Quế Ngọc Hải","age": 15,"address": "TT Văn Giang, Văn Giang, Hưng Yên" , "result": "Nguy cơ cao" },
  {"citizen_id":223896714514,"name": "Nguyễn Trọng Hoàng","age": 22,"address": "TT Văn Giang, Văn Giang, Hưng Yên" , "result": "Nguy cơ cao" },
  {"citizen_id":549903234199,"name": "Đỗ Hùng Dũng","age": 18,"address": "TT Văn Giang, Văn Giang, Hưng Yên" , "result": "Nguy cơ cao" },
  {"citizen_id":706406347609,"name": "Nguyễn Hồng Sơn","age": 19,"address": "TT Văn Giang, Văn Giang, Hưng Yên" , "result": "Nguy cơ cao" },
  {"citizen_id":354626546631,"name": "Lê Huỳnh Đức","age": 20,"address": "TT Văn Giang, Văn Giang, Hưng Yên" , "result": "Nguy cơ cao" },
  {"citizen_id":845173270974,"name": "Triệu Quang Hà","age": 16,"address": "TT Văn Giang, Văn Giang, Hưng Yên" , "result": "Nguy cơ cao" },
  {"citizen_id":551131905441,"name": "Phan Văn Đức","age": 21,"address": "TT Văn Giang, Văn Giang, Hưng Yên" , "result": "Nguy cơ cao" },
  {"citizen_id":169173549543,"name": "Nguyễn Tiến Linh","age": 21,"address": "TT Văn Giang, Văn Giang, Hưng Yên" , "result": "Nguy cơ cao" },
  {"citizen_id":658602521220,"name": "Đoàn Văn Hậu","age": 25,"address": "TT Văn Giang, Văn Giang, Hưng Yên" , "result": "Nguy cơ cao" },
  {"citizen_id":845173270974,"name": "Phan Cao Kỳ","age": 16,"address": "TT Văn Giang, Văn Giang, Hưng Yên" , "result": "Nguy cơ cao" },
  {"citizen_id":551131905441,"name": "Đỗ Quốc Đạt","age": 21,"address": "TT Văn Giang, Văn Giang, Hưng Yên" , "result": "Nguy cơ cao" },
  {"citizen_id":169173549543,"name": "Phùng Trí Đức","age": 21,"address": "TT Văn Giang, Văn Giang, Hưng Yên" , "result": "Nguy cơ cao" },
  {"citizen_id":658602521220,"name": "Hồ Trần Thanh Tuấn","age": 25,"address": "TT Văn Giang, Văn Giang, Hưng Yên" , "result": "Nguy cơ cao" },
  {"citizen_id":822810730815,"name": "Nguyễn Văn Quyết","age": 17,"address": "TT Văn Giang, Văn Giang, Hưng Yên" , "result": "Nguy cơ cao" },
  {"citizen_id":230832268319,"name": "Hồ Văn Cường","age": 20,"address": "TT Văn Giang, Văn Giang, Hưng Yên" , "result": "Nguy cơ cao" },
  {"citizen_id":814530015636,"name": "Đặng Văn Lâm","age": 22,"address": "TT Văn Giang, Văn Giang, Hưng Yên" , "result": "Nguy cơ cao" },
  {"citizen_id":567971098209,"name": "Nguyễn Quang Hải","age": 16,"address": "TT Văn Giang, Văn Giang, Hưng Yên" , "result": "Nguy cơ cao" },
  {"citizen_id":302430915447,"name": "Nguyễn Công Phượng","age": 13,"address": "TT Văn Giang, Văn Giang, Hưng Yên" , "result": "Nguy cơ cao" },
  {"citizen_id":707997446845,"name": "Nguyễn Hoàng Đức","age": 23,"address": "TT Văn Giang, Văn Giang, Hưng Yên" , "result": "Nguy cơ cao" },
  {"citizen_id":673359564378,"name": "Bùi Tiến Dũng","age": 25,"address": "TT Văn Giang, Văn Giang, Hưng Yên" , "result": "Nguy cơ cao" },
  {"citizen_id":708195045557,"name": "Quế Ngọc Hải","age": 15,"address": "TT Văn Giang, Văn Giang, Hưng Yên" , "result": "Nguy cơ cao" },
  {"citizen_id":223896714514,"name": "Nguyễn Trọng Hoàng","age": 22,"address": "TT Văn Giang, Văn Giang, Hưng Yên" , "result": "Nguy cơ cao" },
  {"citizen_id":549903234199,"name": "Đỗ Hùng Dũng","age": 18,"address": "TT Văn Giang, Văn Giang, Hưng Yên" , "result": "Nguy cơ cao" },
  {"citizen_id":706406347609,"name": "Nguyễn Hồng Sơn","age": 19,"address": "TT Văn Giang, Văn Giang, Hưng Yên" , "result": "Nguy cơ cao" },
  {"citizen_id":354626546631,"name": "Lê Huỳnh Đức","age": 20,"address": "TT Văn Giang, Văn Giang, Hưng Yên" , "result": "Nguy cơ cao" },
  {"citizen_id":845173270974,"name": "Triệu Quang Hà","age": 16,"address": "TT Văn Giang, Văn Giang, Hưng Yên" , "result": "Nguy cơ cao" },
  {"citizen_id":551131905441,"name": "Phan Văn Đức","age": 21,"address": "TT Văn Giang, Văn Giang, Hưng Yên" , "result": "Nguy cơ cao" },
  {"citizen_id":169173549543,"name": "Nguyễn Tiến Linh","age": 21,"address": "TT Văn Giang, Văn Giang, Hưng Yên" , "result": "Nguy cơ cao" },
  {"citizen_id":658602521220,"name": "Đoàn Văn Hậu","age": 25,"address": "TT Văn Giang, Văn Giang, Hưng Yên" , "result": "Nguy cơ cao" },
  {"citizen_id":845173270974,"name": "Phan Cao Kỳ","age": 16,"address": "TT Văn Giang, Văn Giang, Hưng Yên" , "result": "Nguy cơ cao" },
  {"citizen_id":551131905441,"name": "Đỗ Quốc Đạt","age": 21,"address": "TT Văn Giang, Văn Giang, Hưng Yên" , "result": "Nguy cơ cao" },
  {"citizen_id":169173549543,"name": "Phùng Trí Đức","age": 21,"address": "TT Văn Giang, Văn Giang, Hưng Yên" , "result": "Nguy cơ cao" },
  {"citizen_id":658602521220,"name": "Hồ Trần Thanh Tuấn","age": 25,"address": "TT Văn Giang, Văn Giang, Hưng Yên" , "result": "Nguy cơ cao" }
]
var resultSearchByListScreen = []

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Route trang chủ
app.get('/', (req, res) => {
  res.render('index', { city: city, district: district, ward: ward });
});

// Tìm kiếm theo CCCD
app.post('/searchById', async (req, res) => {
  const searchQuery = req.body.searchQuery;
  var city_selectbox = req.body.city_selectbox;
  var district_selectbox = req.body.district_selectbox;
  var ward_selectbox = req.body.ward_selectbox;
  var resultJson;

  const url = 'http://192.168.2.31:5000/cccd';
  const postData = {
    id: searchQuery
  };

  const axiosData = await axios.post(url, postData, {
    headers: { 'Content-Type': 'application/json' }
  })
  resultJson = axiosData.data
  resultJson["name"] = "Đặng Quang Thắng"
  resultJson["address"] = "Thị trấn Văn Giang, Văn Giang, Hưng Yên"
  resultJson["result"] =""
  if (resultJson.predictions == 1 ) {
    resultJson["result"] = 'Nguy cơ cao'
  } else {
    resultJson["result"] = 'Nguy cơ thấp'
  }
  console.log(resultJson)
  res.render('resultForSearchById', { data: resultJson, searchQuery: req.body.search });
});



// Tìm kiếm theo địa chỉ
app.post('/searchByAdd', async (req, res) => {
  var resultJson = resultSearchByAddScreen;
  const page = parseInt(req.body.page) || 1; 
  const limit = 10; 
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedItems = resultJson.slice(startIndex, endIndex);
  const totalPages = Math.ceil(resultJson.length / limit);
  setTimeout(() => {
    res.render('resultForSearchByAdd', {
        data: paginatedItems,
        currentPage: page,
        totalPages: totalPages
    });
  }, 3000);
});


// Route xử lý tải file Excel
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);  
  }
});

const upload = multer({ storage: storage });
app.use(express.static(path.join(__dirname, 'uploads')));

// Route trả kết quả theo danh sách file xlsx
app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.send('No file uploaded.');
  }
  
  // Đọc file Excel
  const workbook = xlsx.readFile(req.file.path);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonDataFromExcel = xlsx.utils.sheet_to_json(worksheet)
  console.log("---------------------")
  var list_cccd = []
  
  for (let i = 0; i < jsonDataFromExcel.length; i++) {
    list_cccd.push(parseInt(jsonDataFromExcel[i]["cccd"],10));
  }

  var str_list_cccd = "["+list_cccd.toString() + "]";

  var input = {"id":str_list_cccd};

  if (resultSearchByListScreen.length < 1){
    const url = 'http://192.168.2.31:5000/list';
    const axiosData1 = await axios.post(url, input, {
      headers: { 'Content-Type': 'application/json' }
    })
  
    resultSearchByListScreen = axiosData1.data
  }
  
  var name_list = ["Hà Thái Huy","Nguyễn Thanh Tùng","Nguyễn Duy Mạnh", "Phạm Khánh Hưng", "Nguyễn Mạnh Cường",
  "Nguyễn Thanh Tùng","Lê Thị Ly","Vũ Xuân Hòa","Phạm Vũ Thảo My","Nguyễn Minh Trung",
"Tạ Quang Tiến", "Lê Tùng Lâm", "Nguyễn Văn Bằng", "Nguyễn Quang Huy", "Đinh Xuân Tín",
"Phạm Tiến Triệu", "Đỗ Văn Tiến", "Nguyễn Văn Tuấn", "Chu Xuân Anh", "Nguyễn Văn Phương"]
  for (let i = 0; i < resultSearchByListScreen.length; i++) {
    resultSearchByListScreen[i]["name"] = name_list[getRandomInt(0,19)]
    resultSearchByListScreen[i]["address"] = "TT Văn Giang, Văn Giang, Hưng Yên"
    if (resultSearchByListScreen[i]["predictions"] == 1){
      resultSearchByListScreen[i]["result"]='Nguy cơ cao'
    }else{
      resultSearchByListScreen[i]["result"]='Nguy cơ thấp'
    }
  }

  // Xử lý phân trang
  const page = parseInt(req.body.page) || 1; 
  const limit = 10; 
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedItems = resultSearchByListScreen.slice(startIndex, endIndex);
  const totalPages = Math.ceil(resultSearchByListScreen.length / limit);
    res.render('resultForSearchByList', {
        data: paginatedItems,
        currentPage: page,
        totalPages: totalPages
    });

  // Hiển thị kết quả tìm kiếm
  // res.render('resultForSearchByList', { data: resultJson });
});


// Route to download the file
app.get('/download', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', 'result.xlsx'); // Path to your file
  res.download(filePath, 'result.xlsx', (err) => {
    if (err) {
      console.log("Error during file download", err);
    }
  });
});


app.post('/testpage', (req, res) => {
  var name_list = ["Hà Thái Huy","Nguyễn Thanh Tùng","Nguyễn Duy Mạnh", "Phạm Khánh Hưng", "Nguyễn Mạnh Cường",
    "Nguyễn Thanh Tùng","Lê Thị Ly","Vũ Xuân Hòa","Phạm Vũ Thảo My","Nguyễn Minh Trung",
  "Tạ Quang Tiến", "Lê Tùng Lâm", "Nguyễn Văn Bằng", "Nguyễn Quang Huy", "Đinh Xuân Tín",
  "Phạm Tiến Triệu", "Đỗ Văn Tiến", "Nguyễn Văn Tuấn", "Chu Xuân Anh", "Nguyễn Văn Phương",
"Hà Thái Huy","Nguyễn Thanh Tùng","Nguyễn Duy Mạnh", "Phạm Khánh Hưng", "Nguyễn Mạnh Cường",
    "Nguyễn Thanh Tùng","Lê Thị Ly","Vũ Xuân Hòa","Phạm Vũ Thảo My","Nguyễn Minh Trung",
  "Tạ Quang Tiến", "Lê Tùng Lâm", "Nguyễn Văn Bằng", "Nguyễn Quang Huy", "Đinh Xuân Tín",
  "Phạm Tiến Triệu", "Đỗ Văn Tiến", "Nguyễn Văn Tuấn", "Chu Xuân Anh", "Nguyễn Văn Phương",]
  for (let i = 0; i < resultSearchByListScreen.length; i++) {
    resultSearchByListScreen[i]["name"] = name_list[getRandomInt(0,19)]
    resultSearchByListScreen[i]["address"] = "TT Văn Giang, Văn Giang, Hưng Yên"
    if (resultSearchByListScreen[i]["predictions"] == 1){
      resultSearchByListScreen[i]["result"]='Nguy cơ cao'
    }else{
      resultSearchByListScreen[i]["result"]='Nguy cơ thấp'
    }
  }
  const page = parseInt(req.body.page) || 1; // Nhận trang từ dữ liệu POST
  const limit = 10; // Số mục mỗi trang
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedItems = resultSearchByListScreen.slice(startIndex, endIndex);
  const totalPages = Math.ceil(resultSearchByListScreen.length / limit);

    res.render('resultForSearchByList', {
        data: paginatedItems,
        currentPage: page,
        totalPages: totalPages
    });
});


module.exports = app;
