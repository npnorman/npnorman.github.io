# Nicholas Norman June 2025
# The goal of this file is to generate an HTML document with links to everything in the repository

import os

#for each directory/file
def getFileLinks(path, originalPath):
    
    dirList = os.listdir(path)

    linkList = []
    directoryList = []

    for dir in dirList:

        linkPath = path.replace(originalPath, "") + f"/{dir}"
        
        if ".git" in dir:
            #skip
            pass
        elif ".html" in dir:
            #file
            linkList.append(linkPath + "\n")
        
        elif "." in dir:
            pass
            
        else:
            #directory
            directoryList.append(linkPath)

    for dir in directoryList:
        linkList += getFileLinks(originalPath + dir, originalPath)
    
    return linkList


def main():
    originalPath = os.getcwd()

    links = getFileLinks(originalPath, originalPath)

    file = open("./backend/currentHTMLfiles.txt", "w", encoding="utf-8")
    file.writelines(links)

if __name__ == "__main__":
    print("Running...")
    main()
    print("Completed")