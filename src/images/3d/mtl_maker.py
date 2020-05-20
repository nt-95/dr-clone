import pprint

#un fichier mtl contient les informations sur le materiau associe a un objet 3d, et indique le chemin vers la texture (image nomdelamarque.jpg ou autre)
#toutes les canettes sont un objet can.obj, associes via leur mtl correspondants, a des textures differentes
#parmi tous ces mtl, le seul element qui varie est la derniere ligne, indiquant le chemin vers la texture "map_Kd nomdelamarque.jpg"
#ce script permet de fabriquer automatiquement des fichiers mtl en recuperant le nom des textures "nomdelamarque.jpg", et en ajoutant ce string a la fin d'un template de fichier mtl

def make_template():
    #cette fonction permet soit de fabriquer une liste avec le contenu d'un mtl, et d'output cette liste dans un fichier txt 
    mtlstream = open("aplus.mtl")#on ouvre un fichier mtl quelconque, ici j'ai utilise un fichier nomme aplus.mtl
    mtl_lines = mtlstream.readlines() #on fabrique une liste contenant le fichier mtl, qui fera office de template
    mtl_lines = mtl_lines[:-1] #on supprime la derniere ligne "map_Kd nom.jpg"
    out = open("template.txt", "w") #on peut utiliser mtl_lines dans notre programme ou bien l'output sous forme de texte. Ici j'ai copie/colle template.txt pour avoir la liste mtl_template toujours presente dans le script
    out.write(str(mtl_lines))
    mtlstream.close()
    out.close()

def make_mtls(mtl_template):
    stream  = open("filenames.txt") #un fichier texte contenant la marque.jpg et marque.mtl avec saut a la ligne entre chaque
    for line in stream:
        if 'jpg' in line:
            line = line.strip("\n") #on ne veut que les fichiers jpg
            jpg_name = line # on enregistre le nom jpg dans une variable
            trademark = jpg_name[:-4] #on retire l'extension jpg pour n'avoir que la marque      
            mtl_template.append("map_Kd "+jpg_name) #a la fin du template mtl on restitue la derniere ligne avec le nom du jpg
            newmtl = open(trademark+".mtl", "w") #on cree un nouveau fichier mtl
            for line in mtl_template:
                newmtl.write(line)#on restitue le contenu de mtl_template
            newmtl.close()
            mtl_template = mtl_template[:-1] # on retire a nouveau la derniere ligne du template
    stream.close()

mtl_template = ["# Blender MTL File: 'Can.blend'\n", '# Material Count: 2\n', '\n', 'newmtl Material.002\n', 'Ns 596.755118\n', 'Ka 0.365079 0.365079 0.365079\n', 'Kd 0.800000 0.800000 0.800000\n', 'Ks 0.500000 0.500000 0.500000\n', 'Ke 0.000000 0.000000 0.000000\n', 'Ni 1.450000\n', 'd 1.000000\n', 'illum 3\n', '\n', 'newmtl Material.004\n', 'Ns 477.734676\n', 'Ka 1.000000 1.000000 1.000000\n', 'Kd 0.800000 0.800000 0.800000\n', 'Ks 0.500000 0.500000 0.500000\n', 'Ke 0.000000 0.000000 0.000000\n', 'Ni 1.450000\n', 'd 1.000000\n', 'illum 2\n']
make_mtls(mtl_template) 