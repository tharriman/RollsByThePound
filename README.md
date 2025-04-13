# Team Echo

This is the team repository for Team Echo

## Project

Project details follow. 

### Project Name

Rolls By The Pound

### Project Description  

Rolls By The Pound is a small-business bakery located in Newark, OH. This web application will serve as an online odering service for their bakery. The app will allow users to create a profile, browse the menu, add items to their cart, customize items, and checkout. The user will also have access to past orders and allow them to reorder from that dashboard.

### Tech Stack

Frontend: Next.js (React-based)\
Backend: Next.js\
Database: PostgreSQL (Supabase)


## Team

Team details follow

### 495 Project Leader

Tyler Harriman

### 394 Students - Sr. Developers

Abdinasir Aidrus\
Chanel Elmurr\
Paul Moskalyuk

### 294 Students - Jr. Developers

Stanley Pierre-Canel\
Chris Stickney

## Set Up

Details on how to set up the project follow.

-If you do not already have **node.js** installed on your computer, you will need to do that first. (You can see if you have it by typing **node -v** in your command prompt. If it returns anything other than a version number, you do not have it yet.)\
-To install it, head to **[https://nodejs.org/en/download](https://nodejs.org/en/download)** and download the LTS version (long-term support).\
      The easiest way is to click "Copy to clipboard", open PowerShell on your computer and then paste and run the script.
-To verify everything has been installed correctly, you can type **node -v** and it should return the version number (e.g., v22.13.1) as well as **npm -v**.

Once you have node.js installed, you need to create a folder on your computer, preferrably your Desktop or Documents, called **SP25_Echo** or something similar.

To clone the repo to your new folder, there are a few ways to do this (pick one):
1) git bash\
   navigate to your new folder (e.g., **cd Desktop/SP25_Echo**)\
   once you are in the folder, type **git clone https://github.com/FranklinUniversityCompSciPracticum/SP25_Echo.git** (note: ctrl+v does not paste in git bash, but you can right-click and select paste)
2) GitHub Desktop - [Download link](https://desktop.github.com/download/) \
   click File > Clone repository...\
   using the URL tab, enter **FranklinUniversityCompSciPracticum/SP25_Echo**\
   for local path, select the new folder you created (note: it will automatically append "\SP25_Echo" to the path since that is what the repo is called.)
   click "Clone"

After you clone the repository, you can open it in your IDE. The one I will be using is IntelliJ (Ultimate edition is free for students if you use your Franklin email). Another very popular one is VS Code. Go with whichever you are more familiar with.

## Run the application
-To run the application in your IDE, you need to open a terminal inside the IDE.\
-From there, you will type **cd ./sp25_echo**\
-Then, type **npm install** (this should only need to be done once)\
-Once that finishes, you can type **npm run dev**\
-After it is spun up, you can go to **localhost:3000** in your browser\
-Once you are done working on the application, in the terminal window you need to do **ctrl+c**\
-If will ask if you want to terminate batch job. You will press **y** then enter.
-This will close down port 3000.\
-You can type **npm run dev** whenever you want to start the project back up.\
Note: if you get npm error messages, you are most likely in the wrong directory (i.e., you need to make sure you are in YOUR_FOLDER_NAME/sp25_echo).
