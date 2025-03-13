# freeDuplicateFinder
made this to replace those stupid pay to use duplicate file finder programs. Two seperate, one web based and one Node.Js based 
Duplicate File Finder
A tool to find and manage duplicate files on your system with both command-line (Node.JS version) and web-based interface.
Features

Scan directories for duplicate files
Identify duplicates using content hash comparison (not just filenames)
Group identical files together
Select which duplicates to delete
Confirm before deleting any files
Available as both CLI tool and web application

Command-Line Version
The command-line version is a Node.js script that can scan directories and manage duplicate files.
Requirements

Node.js (v12.0 or later)

Installation

Save the duplicate-file-finder.js file to your computer
Open a terminal or command prompt
Navigate to the directory containing the file

Usage

Run the script:
Copynode duplicate-file-finder.js

Enter the path to the directory you want to scan when prompted
The tool will scan all files in the directory and its subdirectories
Review the duplicate groups displayed in the console
For each group, select which files to delete (or press 'k' to keep all files)
Confirm your selections before the files are deleted

How It Works

The script recursively scans the specified directory for all files
Files are first grouped by size (files of different sizes cannot be duplicates)
Within each size group, the content of each file is hashed using MD5
Files with identical hashes are grouped together as duplicates
You can then select which duplicates to remove

Web-Based Version
The web-based version provides a user-friendly interface for finding duplicate files.
Requirements

Modern web browser (Chrome, Edge, or Firefox recommended)

Installation

Save the duplicate-file-finder-web.html file to your computer

Usage

Open the HTML file in your web browser
Click the directory input to select files and folders to scan

Note: Due to browser security limitations, you must manually select the files/folders


Click "Scan for Duplicates" to analyze the selected files
Review the duplicate groups displayed on the page
Select the checkboxes next to files you want to delete

Note: At least one file from each group will remain unselected to preserve the content


Click "Delete Selected Files" to delete the selected files

Note: Due to browser security restrictions, this web app cannot actually delete files



How It Works

The web app uses the File API to access the selected files
Files are grouped by size and then hashed using SHA-256
Files with identical hashes are displayed in groups
The interface allows you to select which duplicates to remove

Limitations
Command-Line Version

Requires Node.js to be installed
May be slow on large directories with many files
Requires command-line knowledge

Web-Based Version

Cannot actually delete files due to browser security restrictions
Limited to files manually selected by the user (cannot scan entire drive)
Performance may be limited when scanning many files

Security Notes

The command-line version has full access to your file system and can delete files
The web-based version runs entirely in your browser and cannot access files unless you explicitly select them
Neither version sends any data over the internet

Future Improvements

Add option to move duplicates to a separate folder instead of deleting
Implement file preview functionality
Add filtering options (by file type, age, etc.)
Create a proper desktop application with full file system access
Add support for excluding certain directories from the scan

License
This tool is provided as open-source software. Feel free to modify and distribute it according to your needs.
Contributors
Created by The Aaron Isaac Fisher
Feedback and Issues? Email theaaronisaacfisher@gmail.com

Hope you have a fantastic day! 
