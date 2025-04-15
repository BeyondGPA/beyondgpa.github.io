import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as d3 from 'd3-dsv';

@Injectable({ providedIn: 'root' })
export class DataService {
  constructor(private http: HttpClient) {}

  async loadCareerData(): Promise<any[]> {
    const csv = await this.http.get('assets/data/education_career_success-3.csv', 
      { responseType: 'text' }).toPromise();
    return d3.csvParse(csv || '');
  }
}
