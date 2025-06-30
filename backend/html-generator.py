# Nicholas Norman June 2025
# The goal of this file is to generate an HTML document with links to everything in the repository

import os

#generate HTML header
def generateHeader():
    header = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Directory</title>
    <link rel="stylesheet" href="directory.css">
</head>
<body>
<a href="/">Back to Home</a>
<ul>
<li><b>root</b>/</li>\n"""

    return header

#generate closing for HTML
def generateClosing():
    closing = """</ul>
</body>
</html>"""

    return closing

#for each directory/file
def getFileLinks(path, originalPath, recurseCount):

    recurseCount += 1

    dirList = os.listdir(path)

    linkList = []
    directoryList = []

    for dir in dirList:

        linkPath = path.replace(originalPath, "") + f"/{dir}"

        if ".git" in dir:
            #skip
            pass
        elif "." in dir:
            #file
            linkList.append(f"{(recurseCount - 1) * " ║ "}{" ╠ "}<a href='{linkPath}'>{dir}</a>")
            
        else:
            #directory
            # print(path + "/" + dir)
            # linkList.append(f"{f"{recurseCount+1}_{path.replace(originalPath, "")}"}{recurseCount * " ║ "}{linkPath + "/"}")
            directoryList.append(linkPath + "/")

    for dir in directoryList:
        linkList.append(f"{recurseCount * " ║ "}<b>" + dir + "</b>")
        linkList += getFileLinks(originalPath + dir, originalPath, recurseCount)
    
    return linkList


def main():
    #open the file
    file = open("backend/directory.html", "w", encoding="utf-8")

    file.writelines(generateHeader())

    originalPath = os.getcwd()

    links = getFileLinks(originalPath, originalPath, 0)

    for link in links:
        file.writelines("<li>" + link + "</li>" + "\n")

    file.writelines(generateClosing())

    file.close()

if __name__ == "__main__":
    print("Running...")
    main()
    print("Completed")