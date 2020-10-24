import { Component, OnInit } from '@angular/core';
import { StudentService } from '../shared/services/student.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {

  students: any[] = [];

  constructor(private studentService: StudentService) { }

  ngOnInit(): void {
    this.studentService.getAll().subscribe( (result: any[]) => {
      this.students = result;
    });
  }

}
