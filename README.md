# BeyondGPA

## 📌 Overview
BeyondGPA is a data-driven project exploring the relationship between academic performance and career success. Using a dataset of **10000 students**, we analyze how factors like GPA, university ranking, internships, and networking influence salary, job offers, and career satisfaction.

📊 **Dataset Source**: [Education & Career Success Dataset](https://www.kaggle.com/datasets/adilshamim8/education-and-career-success)

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Dataset Description](#-dataset-description)
- [Research Question](#-research-question)
- [Analysis Goals](#-analysis-goals)
- [Project Structure](#project-structure)
- [How to Use](#-how-to-use)
- [How to Deploy](#-how-to-deploy)
- [Technologies](#-technologies)
- [License](#-license)

---

## 📂 Dataset Description

The dataset consists of **10000 records**, each representing a student's academic and career background. The features are grouped into four categories:

1. **Personal Information**
   - Age (18-30 years)
   - Gender (Male, Female, Other)

2. **Academic Performance**
   - High School GPA (2.0 - 4.0 scale)
   - SAT Score (900 - 1600)
   - University Ranking (1 - 1000)
   - University GPA (2.0 - 4.0 scale)
   - Field of Study (e.g., Computer Science, Medicine, Business)

3. **Skills & Experiences**
   - Internships Completed (0-4)
   - Projects Completed (0-9)
   - Certifications Earned (0-5)
   - Soft Skills Score (1-10)
   - Networking Score (1-10)

4. **Career Outcomes**
   - Job Offers (0-5)
   - Starting Salary ($25,000 - $150,000)
   - Career Satisfaction (1-10)
   - Years to Promotion (1-5 years)
   - Current Job Level (Entry, Mid, Senior, Executive)
   - Work-Life Balance (1-10)
   - Entrepreneurship (Yes/No)

---

## ❓ Research Question

### **"Does academic success truly determine career success, or do internships, networking, and soft skills play a bigger role?"**

---

## 🎯 Analysis Goals

1. **Correlation Between Academic Performance and Salary**
   - Do students with a **higher GPA** and **better university rankings** earn more?

2. **Impact of Practical Experience**
   - Do **internships** and **certifications** compensate for a lower GPA in terms of job opportunities?

3. **Factors Influencing Career Satisfaction**
   - Are students from **top universities** more satisfied with their careers, or do other factors like **work-life balance** and **soft skills** matter more?

---

## Project Structure

The project is organized as follows:

```
BeyondGPA.github.io/
└─ client/src/
   ├─ app/
   │  ├─ components/
   │  │  ├─ header/
   │  │  │  ├─ header.component.ts
   │  │  │  ├─ header.component.html
   │  │  │  └─ header.component.scss
   │  │  ├─ viz-section/
   │  │  │  ├─ viz-section.component.ts
   │  │  │  ├─ viz-section.component.html
   │  │  │  └─ viz-section.component.scss
   │  │  └─ d3/
   │  │     ├─ sankey-viz/
   │  │     │  ├─ sankey-viz.component.ts
   │  │     │  ├─ sankey-viz.component.html
   │  │     │  └─ sankey-viz.component.scss
   │  │     └─ scatter-viz/
   │  │        ├─ scatter-viz.component.ts
   │  │        ├─ scatter-viz.component.html
   │  │        └─ scatter-viz.component.scss
   │  ├─ pages/
   │  │  └─ main-page/
   │  │     ├─ main-page.component.ts
   │  │     ├─ main-page.component.html
   │  │     └─ main-page.component.scss
   │  └─ services/
   │     ├─ data/
   │     │  └─ data.service.ts
   │     └─ theme/
   │        └─ theme.service.ts
   ├─ assets/
   │  ├─ data/
   │  │  └─ education_career_success.csv
   │  ├─ icons/
   │  │  ├─ moon.svg
   │  │  ├─ moon_hover.svg
   │  │  ├─ sun.svg
   │  │  ├─ sun_hover.svg
   │  │  ├─ language.svg
   │  │  ├─ language_light.svg
   │  │  └─ language_dark.svg
   │  └─ beyondGPA.png
   └─ styles.scss
```

---


## 🚀 How to Use

1. Clone the repository:
   ```bash
   git clone https://github.com/BeyondGPA/beyondgpa.github.io.git
   ```

2. Navigate to the project directory:
   ```bash
   cd beyondgpa.github.io
   cd client
   ```

2. Install Dependencies  
    ```bash
    npm install
    ```

3. Run the Project  
    ```bash
    npm start
    ```

4. Access the app at `http://localhost:4200/`.

---

## 🌍 How to Deploy

1. Run the build command :

   ```bash
   ng build --configuration production --base-href "https://BeyondGPA.github.io"
   ```

2. Deploy with `angular-cli-ghpages`:

   ```bash
   ngh --dir=dist/client
   ```

---

## 🔧 Technologies

- **📊 Data Processing & Visualization**: [D3.js](https://d3js.org/)  
- **🌐 Web Interface**: [Angular](https://angular.io/)  
- **📂 Data Handling**: D3.js for data manipulation and analysis  

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
