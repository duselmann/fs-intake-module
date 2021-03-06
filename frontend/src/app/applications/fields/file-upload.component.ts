import { Component, Input, OnChanges } from '@angular/core';
import { FileSelectDirective, FileUploader, FileLikeObject, FileItem } from '../../../../node_modules/ng2-file-upload/ng2-file-upload';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-file-upload-field',
  templateUrl: './file-upload.component.html'
})

export class FileUploadComponent implements OnChanges {
  @Input() applicationId: number;
  @Input() name: string;
  @Input() uploadFiles: boolean;

  allowedMimeType = [
    'application/msword',
    'application/pdf',
    'application/rtf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  errorMessage: string;
  maxFileSize = 25 * 1024 * 1024;
  uploader: FileUploader;

  constructor() {
    this.uploader = new FileUploader({
      url: environment.apiUrl + 'permits/applications/special-uses/temp-outfitters/file',
      maxFileSize: this.maxFileSize,
      allowedMimeType: this.allowedMimeType,
      queueLimit: 2
    });
    this.uploader.onWhenAddingFileFailed = (item, filter, options) => this.onWhenAddingFileFailed(item, filter, options);
    this.uploader.onAfterAddingFile = (fileItem) => this.onAfterAddingFile(this.uploader);
  }

  onAfterAddingFile(uploader) {
    if (uploader.queue.length > 0) {
      this.errorMessage = '';
    }
    if (uploader.queue.length > 1) {
      uploader.removeFromQueue(uploader.queue[0]);
    }
  }

  onWhenAddingFileFailed(item: FileLikeObject, filter: any, options: any) {
    switch (filter.name) {
      case 'fileSize':
        this.errorMessage = `Maximum upload size exceeded (${item.size} of ${this.maxFileSize} allowed)`;
        break;
      case 'mimeType':
        const allowedTypes = this.allowedMimeType.join();
        this.errorMessage = `The file type "${item.type} is not allowed. The allowed file types are "${allowedTypes}"`;
        break;
      default:
        this.errorMessage = `Unknown error (filter is ${filter.name})`;
    }
  }

  ngOnChanges() {
    this.uploader.options.additionalParameter = { applicationId: this.applicationId };
    if (this.uploadFiles) {
      this.uploader.uploadAll();
    }
  }
}
