# Ce script permet de creer un fichier texte contenant sous forme d'array le nom de tous les fichiers .mtl que nous voulons utiliser dans main.js.
# Apres avoir execute via le terminal CMD la commande dir /B > filenames.txt pour obtenir un fichier txt avec le nom de tous les fichiers du dossier
# ce script ouvre filenames.txt, et ajoute toutes les lignes contenant l'extension 'mtl' dans un array.
# Il exporte cet array dans un nouveau fichier texte, que l'on pourra ensuite copier/coller dans la variable mtlnames de notre main.js

stream  = open("filenames.txt")
out = open("mtlnames_2array.txt", "w")
namelist = []
for line in stream:
    if 'mtl' in line:
        line = line.strip("\n")
        namelist.append(line)
namelist = str(namelist)    
out.write(namelist)   
stream.close()