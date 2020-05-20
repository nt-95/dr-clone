import pprint


def make_mtl_array():
    # Cette fonction permet de creer un fichier texte contenant sous forme d'array le nom de tous les fichiers .mtl que nous voulons utiliser dans main.js.
    # Apres avoir execute via le terminal CMD la commande dir /B > filenames.txt pour obtenir un fichier txt avec le nom de tous les fichiers du dossier
    # cette fonction ouvre filenames.txt, et ajoute toutes les lignes contenant l'extension 'mtl' dans un array.
    # Il exporte cet array dans un nouveau fichier texte, que l'on pourra ensuite copier/coller dans la variable mtlnames de notre main.js
    # Cette fonction ne nous est plus utile car main.js desormais importe tout seul les mtl necessaires directement depuis le dossier
    stream = open("filenames.txt")
    out = open("mtlnames_2array.txt", "w")
    namelist = []
    for line in stream:
        if 'mtl' in line:
            line = line.strip("\n")
            namelist.append(line)
    namelist = str(namelist)
    out.write(namelist)
    stream.close()


def update_cans_object():
    # Cette fonction met a jour l'objet cans{} dans cans_object.js, qui est importe dans main.js, et qui contient toutes les infos sur les canettes

    # on ouvre le fichier js qui contient l'objet cans {}, mode read sinon readlines() ne fonctionne pas
    cans_object = open("cans_object.js", "r")
    # On va recuperer tout l'objet sous forme d'array, pour savoir quelles marques ils contient deja, et pour supprimer le dernier crochet
    cansobj2array = cans_object.readlines()
    cans_object.close()
    # on enleve le dernier } dans la liste
    lastline = len(cansobj2array)-1
    if cansobj2array[lastline] == '};':
        cansobj2array = cansobj2array[:-1]

    # on recree le fichier cans_object sans le crochet final
    # le mode 'w' write ecrase les donnees du fichier ouvert avec les nouvelles
    treated_trademarks = [] # une liste qui contiendra le nom des marques deja presentes dans l'objet cans_object.js
    cans_object = open("cans_object.js", "w")
    for line in cansobj2array:
        cans_object.write(line)
        # on profite de l'iteration pour recuperer sous forme de liste, les marques deja presentes dans l'objet cans_object
        line.strip("\n")
        # les cles sont des lignes de forme "nom: {", ce sont les seules lignes a terminer par les caracteres ": {"
        if line[-4:-1] == ": {":
            trademark = line[:-4].strip()  # le nom des cles ; elles ont une indentation qu'on enleve avec strip()
            treated_trademarks.append(trademark)
    cans_object.close()

    # on met a jour l'objet cans_object en ajoutant toutes les marques de canettes et leur proprietes, si elles ne sont pas deja presentes
    # fichier contenant le nom de toutes les canettes
    stream = open("filenames.txt")
    # fichier js qui contient l'objet cans {}, mode a+ pour ajouter des donnees dans un fichier sans ecraser les anciennes
    cans_object = open("cans_object.js", "a+")
    for line in stream:
        if 'jpg' in line:
            line = line.strip("\n")  # on enleve le saut a la ligne
            trademark = line[:-4]  # on enleve l'extension .jpg
            if trademark not in treated_trademarks:
                print(">>>>>>> "+trademark+" not in cans_object.js")
                cans_object.write(
                    trademark+": {\nname: '',\ningredients: '',\nnutrition: '',\nmanufacturer: '',\ndescription: ''},\n")
            else:
                print(trademark+" already in cans_object.js")
    cans_object.write("\n};")
    stream.close()

# --------------------- MAIN -------------------------------------


update_cans_object()
