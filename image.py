import pymongo
from PIL import Image
import io
from bson import ObjectId

# Connect to MongoDB
client = pymongo.MongoClient("mongodb+srv://bruno:brunoyvalen2709@cluster0.swjtrex.mongodb.net/")
db = client["Remises_App_prod"]
collection = db["cars"]

def store_image(image_path, document_id):
    # Open the image using PIL
    with open(image_path, "rb") as image_file:
        image_binary = image_file.read()
        
    # Convert the document_id to ObjectId
    object_id = ObjectId(document_id)
    
    # Create or update the specific document with the image data in MongoDB
    image_document = {"_id": object_id, "img": image_binary}
    collection.replace_one({"_id": object_id}, image_document, upsert=True)
    print("Image stored successfully in document with ID:", object_id)

if __name__ == "__main__":
    image_path = "car.png"  # Replace with the path to your image
    document_id = "64bdd09e3b7c26ae72b83add"  # Replace with the desired unique identifier
    store_image(image_path, document_id)
