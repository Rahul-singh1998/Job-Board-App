import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first, forkJoin } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  jobs: any = [];
  allJobIds: number[] = [];
  fetchingJobDetails = false;
  page = 0;

  page_no = 6;
  api_url = 'https://hacker-news.firebaseio.com/v0';

  http = inject(HttpClient);

  ngOnInit() {
    this.http.get<number[]>(`${this.api_url}/jobstories.json`,).pipe(first()).subscribe((ids: number[]) => {
        this.allJobIds = ids;
        this.fetchJobs();
      });
  }

  showMore() {
    this.fetchJobs();
  }

  fetchJobs() {
    const start = this.page * this.page_no;
    const end = start + this.page_no;
    const ids = this.allJobIds.slice(start, end);
    this.fetchingJobDetails = true;

    forkJoin(
      ids.map((id: number) =>
        this.http.get<any>(
          `${this.api_url}/item/${id}.json`,
        ),
      ),
    )
      .pipe(first())
      .subscribe((jobs: any) => {
        this.jobs = [...this.jobs, ...jobs];
        this.fetchingJobDetails = false;
        this.page++;
      });
  }
}
