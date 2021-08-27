import cv2
import argparse
import socketio
import base64
from threading import Timer
import multiprocessing
import psutil
import time
from pymongo import MongoClient
client = MongoClient(port=27017)
db=camx

#parser = argparse.ArgumentParser()
#parser.add_argument('--rtsp', help='rtsp of camera')
#parser.add_argument('--hwId', help='room to send images to')
#parser.add_argument('--customerId', help='customer ID')
#parser.add_argument('--title', help='title of camera')

#args = parser.parse_args() 
#print("parsing {}".format(args.rtsp))

#rtsp = args.rtsp
#title = args.title
#hwId = args.hwId
#customerId = args.customerId


#face_detector = cv2.CascadeClassifier("haarcascade_frontalface_alt2")
#video = cv2.VideoCapture('rtsp://admin:12345abcD@papayawarren.myq-see.com:9090/Streaming/Channels/202')
#video = cv2.VideoCapture('rtsp://admin:5091Mike7@@schoolcraft2.changeip.org:554/Streaming/Channels/302')
#conn = pyodbc.connect('Driver={ODBC Driver 17 for SQL Server};Server=192.168.2.245;DATABASE=ImmixCloud;UID=sa;PWD=Admin12821istrator;')

#cursor = conn.cursor()
#cursor.execute('select GroupID, Host, Port, Username, Password FROM Servers WHERE ServerTypeID = 521;')


sio = socketio.Client()
print("connecting to socket in namespace {}".format(customerId))
nsp = sio.connect('http://localhost:3001', namespaces=['/{}'.format(customerId)])
processes = []

for proc in psutil.process_iter():
    processes.append(proc.name().lower())

@sio.on('connect', namespace='/{}'.format(customerId))
def connect():
    print('joined room')
    nsp.join(hwId)

def getRtsp():
    print('capturing video')
    video = cv2.VideoCapture(rtsp)
    while True:
        ret,frame = video.read()
        _, jpgencoded = cv2.imencode('.jpg', frame)
        newframe = jpgencoded.tostring()
        print(jpgencoded)
        image = base64.b64encode(newframe).decode('utf-8')
        while True:
            sio.emit('rtspimage', {'image': image, 'hwId': hwId}, namespace='/{}'.format(customerId)) 
            print("sending images to {} in namespace {}".format(hwId,customerId))
            time.sleep(1/25)
            break
    

if hwId not in processes:
    print("no process for {} is running".format(hwId))
    sio.emit('rtspjoin', hwId, namespace='/{}'.format(customerId))
    multiprocessing.Process(name=hwId, target=getRtsp())
 
        