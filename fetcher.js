const request = require('request');
const fs = require('fs');

const url = process.argv[2];
const filePath = process.argv[3];

// checck if the file already exist

if (fs.existsSync(filePath)){
  console.log('File already exists.');
  process.stdout.write(`Do you want to overwrite the file? (Y/N) `);
  process.stdin.once('data', (input) => {
    const answer = input.toString().trim().toLowerCase();
    if (answer === 'y') {
      downloadFile(url, filePath);
    } else {
      console.log('Exiting...');
      process.exit(0);
    }
  });
} else {
  downloadFile(url, filePath);
}

function downloadFile(url, filePath){

  request(url, (error, response, body) => {
    
    if (error) {
      console.error(`Error downloading resource: ${error.message}`);
      return;
    }

    if (response.statusCode !== 200) {
      console.error(`Failed to download resource. Status code: ${response.statusCode}`);
      return;
    }

    fs.writeFile(filePath, body, (error) => {
      if (error) {
        console.error(`Error writing file: ${error.message}`);
        return;
      }
      console.log(`Downloaded and saved ${body.length} bytes to ${filePath}`)
      // fs.stat(filePath, (error, stats) => {
      //   if (error) {
      //     console.error(`Error getting file size: ${error.message}`);
      //     return;
      //   }

      //   console.log(`Downloaded and saved ${stats.size} bytes to ${filePath}`);
      // });
    });
  });
}
