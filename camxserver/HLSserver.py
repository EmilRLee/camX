import threading
import subprocess
import datetime
from retry import retry
from multiprocessing import Process
import psutil
import time
import pprint
import json
import os
from bson.objectid import ObjectId
from pymongo import MongoClient
client = MongoClient(port=27017)
db = client.camx
collection = db.users
#change_stream = collection.watch()
external_devices = []
commands = []
commands_ran = []
builder = "ffmpeg -i"  
options = "-f hls -hls_time 3 -hls_playlist_type event -hls_list_size 10 -hls_wrap 10 -live_start_index 9 -hls_segment_type fmp4 -filter:v fps=10"     

@retry(backoff=3)
def createRTSP(command):
        
    os.popen(command)
        

def main():
    i = 1
    while True:
        try:
            for user in db.users.find():
                
                for key, value in user.items():
                    if key == "_id":
                        customerId = str(ObjectId(value))
                        saveTo = "./streams/{}/".format(value)
                    if key == "external_cams":
                        for cam in value:
                            hwId = ""
                            rtsp = ""
                            for keys, values in cam.items():
                                if keys == "hwId":
                                    hwId = values
                                if keys == "uri":
                                    rtsp = values
                            if "{} {} {} {}{}/{}.m3u8".format(builder,rtsp,options,saveTo,hwId,hwId) not in commands:
                                commands.append("{} {} {} {}{}/{}.m3u8".format(builder,rtsp,options,saveTo,hwId,hwId))                   
            for command in commands:
                if command not in commands_ran:
                    print("rtsp daemon created")
                    print(command)
                    commands_ran.append(command)
                    #subprocess.Popen(command, shell=False)
                    p = Process(target=createRTSP, args=(command,))
                    p.start()
                    i = i + 1
                    time.sleep(1)
                    
                    
            print("try sleeping")
            time.sleep(30)
        except Exception as e:
            print(e)
            time.sleep(30)
            continue

if __name__ == '__main__':
    main()