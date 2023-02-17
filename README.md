# Multi_file_check_v2
## NodeJS web service for multi-level virus scanning of files
My student project of a web service for multi-level virus scanning of files. It was created during the my graduate work in 2020.
In it use NodeJS for server which accepts clients requests.
In this version not add antivirus module because i'm use api open-source antivirus engine ClaimAV and the SimpleAV engine (a small anti-virus engine co-written by me and my mentor for another academic coursework). But in this project includes two JS modules and JSON config's for use antivirus modules.

**This project includes:** 
1. checksum calculation module
2. local db check module (added test virus signatures)
3. Virustotal service api use module (to run it use Curl)
4. two antivirus modules
5. base module, dicribeing test execution process.
