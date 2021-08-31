import cv2
import argparse
import socketio
import base64
import time
import asyncio


sio = socketio.Client()

parser = argparse.ArgumentParser()
parser.add_argument('--rtsp', help='rtsp of camera')
parser.add_argument('--hwId', help='room to send images to')
parser.add_argument('--customerId', help='customer ID')
parser.add_argument('--title', help='title of camera')

args = parser.parse_args() 
print("parsing {}".format(args.rtsp))

rtsp = args.rtsp
title = args.title
hwId = args.hwId
customerId = args.customerId


#face_detector = cv2.CascadeClassifier("haarcascade_frontalface_alt2")
#video = cv2.VideoCapture('rtsp://admin:12345abcD@papayawarren.myq-see.com:9090/Streaming/Channels/202')
#video = cv2.VideoCapture('rtsp://admin:5091Mike7@@schoolcraft2.changeip.org:554/Streaming/Channels/302')
#conn = pyodbc.connect('Driver={ODBC Driver 17 for SQL Server};Server=192.168.2.245;DATABASE=ImmixCloud;UID=sa;PWD=Admin12821istrator;')

async def connect():

    #print(device['hwId'] + ':' + device['uri'])
    #sio.emit('rtsp', {"hwId": hwId, "customerId": customerId})
    sio.emit('rtspjoin', {"hwId": hwId}, namespace='/{}'.format(customerId))
    print('capturing video')
    #video = cv2.VideoCapture(rtsp, cv2.CAP_FFMPEG)
    while True:
        try:
            while True:
                try:
                    ret,frame = video.read()
                    if ret == False:
                        break
                    _, jpgencoded = cv2.imencode('.jpg', frame)
                    newframe = jpgencoded.tostring()
                    print(jpgencoded)
                    image = base64.b64encode(newframe).decode('utf-8')
                    fps = video.get(cv2.CAP_PROP_FPS)
                    print(fps)
                    await sio.emit('rtspimage', {'image': image, 'hwId': hwId}, namespace='/{}'.format(customerId)) 
                    print("sending images to {} in namespace {}".format(hwId,customerId))
                    time.sleep(1/3)
                    break
                except:
                    time.sleep(10)
                    continue
            
        except Exception as e:
            print(e)
            time.sleep(10)
            continue
print("connecting to socket in namespace {}".format(customerId))
sio.connect('http://localhost:3001', namespaces=['/{}'.format(customerId)])
asyncio.run(connect())
    