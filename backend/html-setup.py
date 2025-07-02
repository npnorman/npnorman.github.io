#Setup a new project for this repo

import os
import re
from datetime import datetime

#if the folder/files do not exist, create them
#if they do exist, do nothing

def main():
    baseUrl = os.getcwd()

    projectNamePretty = input("Provide a project name: ")
    userName = input("Author Name: ")
    date = datetime.now().strftime("%B %Y")
    goal = input("Short description/goal of file: ")

    projectName = projectNamePretty.lower()
    projectName = re.sub(r'[^a-zA-Z0-9]', '-', projectName)
    projectName = re.sub(r'-+', '-', projectName)
    projectName = projectName.rstrip("-")

    newUrl = createUrl(baseUrl, projectName)

    if (os.path.isdir(newUrl)):
        #already exists
        print(f"Project Name {projectName} Already Exists")
    else:
        #create folder
        print("Creating new project")
        os.mkdir(newUrl)

        #create js + css folders
        jsUrl = createUrl(newUrl, "js")
        os.mkdir(jsUrl)

        cssUrl = createUrl(newUrl, "css")
        os.mkdir(cssUrl)

        #create HTML file
        htmlFile = open(createUrl(newUrl, projectName + ".html"), "w")

        htmlFile.writelines(f"<!--{projectName}.html\n")
        htmlFile.writelines(f"    {userName} {date}\n")
        htmlFile.writelines(f"    {goal}-->\n")

        htmlFile.writelines(f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{projectNamePretty}</title>
    <link rel="stylesheet" href="css/{projectName}.css">
</head>
<body>
    <a href="/">Back to Home</a>

    <h1>{projectNamePretty}</h1>
    <h2>{userName} {date}</h2>

    <p>{goal}</p>

    <script src="js/{projectName}.js"></script>
</body>
</html>
""")

        htmlFile.close()

        #create JS file
        jsFile = open(createUrl(jsUrl, projectName + ".js"), "w")

        jsFile.writelines(f"//{projectName}.js\n")
        jsFile.writelines(f"//{userName} {date}\n")
        jsFile.writelines(f"//{goal}\n")

        jsFile.close()
        
        #create CSS file
        cssFile = open(createUrl(cssUrl, projectName + ".css"), "w")

        cssFile.writelines(f"/*{projectName}.css\n")
        cssFile.writelines(f"  {userName} {date}\n")
        cssFile.writelines(f"  {goal}*/\n")

        cssFile.close()

def createUrl(base:str, new:str):
    return f"{base}/{new}"

if __name__ == "__main__":
    main()