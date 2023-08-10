import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root'
})
export class ToasterService {
  constructor(private snackBar: MatSnackBar) {}
  public showSuccess(message: string): void {
    this.openSnackBar(message, 'success-toast');
  }

  public showError(message: string): void {
    this.openSnackBar(message, 'error-toast');
  }

  private openSnackBar(message: string, panelClass: string): void {
    const config: MatSnackBarConfig = {
      duration: 3000, // Display duration in milliseconds
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: [panelClass],
    };
    this.snackBar.open(message, '', config);
  }
}
