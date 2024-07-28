import { Component, ElementRef, ViewChild } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'biomatrixProject';
  @ViewChild('video') videoElm!: ElementRef;
  @ViewChild('canvas') canvasElm!: ElementRef;
  name!: string;
  captureData!: string;
  userMessage!: string;
  bytesArray:any
  private isCameraActive = false;
  private cameraLabelActive = 'Take a photo';
  private cameraLabelInactive = 'Restart camera';
  cameraButtonLabel = this.cameraLabelActive;
  registerButtonLabel = 'Register this photo';
constructor(private apiService:ApiService){

}
  readonly medias: MediaStreamConstraints = {
    audio: false,
    video: {
      facingMode: 'user',
    }
  };
  ngOnInit(): void {
    this.startCamera();
  }
ngOnDestroy(): void {
  this.stopCamera();
}
private startCamera() {
  console.log('starting camera...');

  window.navigator.mediaDevices.getUserMedia(this.medias)
    .then(stream => {
      this.videoElm.nativeElement.srcObject = stream;
      this.isCameraActive = true;
    })
    .catch(error => {
      console.error(error);
      alert(error);
    });
}
onClickCamera() {
  if (this.isCameraActive) {
    this.captureData = this.draw();
    this.captureData = this.captureData.replace('data:image/png;base64,', '');
   console.log(this.captureData);
// Convert base64 data to byte array
const binaryString = atob(this.captureData);
const len = binaryString.length;
var bytesArray = new Uint8Array(len);
for (let i = 0; i < len; i++) {
 bytesArray[i] = binaryString.charCodeAt(i);
  
}
this.bytesArray=bytesArray
console.log(this.bytesArray);
    this.stopCamera();

    this.cameraButtonLabel = this.cameraLabelInactive;
  } else {
    this.captureData = '';
    this.startCamera();

    this.cameraButtonLabel = this.cameraLabelActive;
  }
}
private draw() {
  const WIDTH = this.videoElm.nativeElement.clientWidth;
  const HEIGHT = this.videoElm.nativeElement.clientHeight;

  const ctx = this.canvasElm.nativeElement.getContext('2d') as CanvasRenderingContext2D;
  this.canvasElm.nativeElement.width  = WIDTH;
  this.canvasElm.nativeElement.height = HEIGHT;

  return this.canvasElm.nativeElement.toDataURL(
    ctx.drawImage(this.videoElm.nativeElement, 0, 0, WIDTH, HEIGHT)
  );
}

private stopCamera() {
  console.log('stopping camera...');

  this.videoElm.nativeElement.pause();
  if (this.videoElm.nativeElement.srcObject !== null) {
    const track = this.videoElm.nativeElement.srcObject.getTracks()[0] as MediaStreamTrack;
    track.stop();
  }

  this.isCameraActive = false;
}
onClickRegister() {
  this.registerPhoto();
}
private registerPhoto() {
  if (!this.name) {
    this.userMessage = 'Please fill name';
  } else if (!this.captureData) {
    this.userMessage = 'Please take photo';
  } else {
    this.apiService.sendRequest(this.bytesArray).subscribe(res => {
      console.log(res);
      this.userMessage = 'Registration done.';
    });
  }
}
}
