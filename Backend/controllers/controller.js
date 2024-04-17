import { csvSchemaModel } from '../models/schems.js';
import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';


export const home = async(req, res) => {
    try {
        const csvFiles = await csvSchemaModel.find({});

        return res.render('homePage', {
            files: csvFiles,
            title: 'Home',
            style: '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">',
            script: '<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>',
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }

}

//func to handle the uploads
export const upload = async(req, res) => {
    try {
        if (!req.file) {
            // handle error if file not present
            return res.status(400).send('No files were uploaded.');
        }
        if (req.file.mimetype !== 'text/csv') {
            // handle error if file is not CSV
            return res.status(400).send('Only CSV files are allowed.');
        }

        //parser the uploaded csv file and store it in array
        const results = [];
        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on('data', (data) => {
                results.push(data);
            })
            .on('end', async() => {
                //save csv data to db
                if (req.file) {
                    const oldPath = req.file.path;
                    console.log(process.cwd());
                    const newPath = path.join(process.cwd(), 'uploads', req.file.originalname);
                    fs.rename(oldPath, newPath, (err) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                    const csvData = new csvSchemaModel({
                        filename: req.file.originalname,
                        header_row: results[0],
                        data_rows: results.slice(1),
                        // path: newPath
                    });
                    await csvData.save();
                } else {
                    res.status(400).send('No file uploaded');
                }
                return res.redirect('/');
            });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }

}

// Function to view a CSV file
export const view = async(req, res) => {
    try {
        const csvFile = await csvSchemaModel.findById(req.params.id);
        if (!csvFile) {
            return res.status(404).send('File not found');
        }

        // Read CSV file contents
        const uploadsPath = path.join(process.cwd(), 'uploads');
        const fileData = await new Promise((resolve, reject) => {
            fs.readFile(path.join(uploadsPath, csvFile.filename), 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    // Parse the CSV data and send it to the view
                    const rows = data.trim().split('\n');
                    const header_row = rows[0].split(',');
                    const data_rows = rows.slice(1).map(row => {
                        const row_data = {};
                        row.split(',').forEach((value, index) => {
                            row_data[header_row[index]] = value;
                        });
                        return row_data;
                    });
                    resolve({ filename: csvFile.filename, header_row, data_rows });
                }
            });
        });
        console.log(fileData);

        res.render('csvView', {
            fileData,
            title: 'CSV file',
            style: '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">',
            script: '<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>',
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
}
