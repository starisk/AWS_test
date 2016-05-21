var express = require('express');
var router = express.Router();

var mysql - require('mysql');
var multer - require('multer');
var path - require('path');
var fs - require('fs');

var connection = mysql.createConnection({
	host : 'user_host',
	user : 'user_name',
	password : 'user_pw',
	database : 'user_db'
});

var _storage = multer.diskStorage({
	destination: function(req, file, cb){ //디렉토리 위치
		cb(null, './uploads');
	},
	filename: function(req, file, cb){ //파일명
		cb(null, Date.now() + "," + file.originalname.split('.').pop());
	}
});

var upload = multer({ storage: _storage});

router.get("/", function (req, res) {
	res.render('fileup', function (error, content) {
		if (!error) {
			res.end(content);
		}
		else {
			res.writeHead(501, { 'Content-type' : 'text/plain' });
			res.end("Error while reading a file");
		}
	});
});

router.post('/upload' , upload.single('userphoto'), function (req, res) {
	//file 업로드 구현
	var filename = req.file.filename;
	var path = req.file.path;
	console.log(path);

	connection.query('INSERT INTO file (filename, path) VALUES (?, ?) ;', [filename, path], function (error, info){
		if (error != undefined)
			res.sendStatus(503);
		else
			res.redirect('/' + info.insertID);
	});
	console.log(filename);
});


router.get('/:file.id', function (req, res, next) {
	//파일업로드 완료시, 파일 명 출력
	connection.query('SELECT * FROM file WHERE id = ?;', [req.params.file_id], function (error, cursor) {
		if (error != undefined) {
			res.sendStatus(503);
		}
		else {
			if (cursor.length == undefined || cursor.length < 1)
				res.sendStatus(404);
			else
				res.json(cursor[0]);
		}
	});
});

router.get('/uploads/:file_name', function (req, res, next) {
	connection.query('SELECT * FROM file WHERE filename = ?;', [ req.params.file_name], function (error, cursor) {
		if (error != undefined) {
			res.sendStatus(503):
		}
		else {
			if (cursor.length == undefined || cursor.length <1)
				res.sendStatus(404);
			else
				res.json(cursor[0]);
		}
	});
});

router.het('/uploads/:file_name', function (req, res, next) {
	connection.query('SELECT * FROM file WHERE filename = ?;', [req.params.file_name], function (error, cursor) {
		if (error != undefined) {
			res.sendStatus(503);
		}
		else {
			if (cursor.length == undefined || cursor.length < 1)
				res.sendStatus(404);
			else {
				res.sendFile(path.join(__dirname, '../', cursor[0].path));
			}
		}
	});
});

module.exports = router;