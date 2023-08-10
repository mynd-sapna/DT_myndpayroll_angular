import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileSaverService {

  constructor() { }
  downloadBinary(url: string, filename: string): void {
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', filename);
    a.innerHTML = 'downloading...';
    document.body.appendChild(a);
    setTimeout(() => {
      a.click();
      document.body.removeChild(a);
      setTimeout(() => {
        URL.revokeObjectURL(a.href);
      }, 250);
    }, 66);
  }

  downloadDataURL(url: string, filename: string, winMode: boolean): void {
    const iframe = document.createElement('iframe');
    document.body.appendChild(iframe);
    if (!winMode) {
      url = 'data:' + url.replace(/^data:([\w\/\-\+]+)/, 'u');
    }
    iframe.src = url;
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 333);
  }

  dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }
}
