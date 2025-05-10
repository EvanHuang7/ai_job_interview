import {generateText} from "ai";
import {google} from "@ai-sdk/google";

import {db} from "@/lib/firebase/admin";
import {getRandomInterviewCover, sanitizeText} from "@/lib/utils";

const dummyResume = `Professional Summary
Experienced Software Developer specializing in AI-powered applications, with proven expertise in GoLang and Angular. Led the development of an innovative communications app at Vendasta, enhancing SMB customer engagement. Adept at mentoring, with a focus on achieving project milestones through teamwork.
Experience
Software developer
May 2020 - September 2024│Vendasta, Saskatoon 
Tech stacks: GoLang, Angular, TypeScript, Python, JavaScript, Kubernetes, Google Cloud Platform, Elasticsearch, MySQL, PostgreSQL, Firebase, Cloud Pub/Sub, GRPC, Microservices, CI/CD pipelines
· Developed an AI-powered communications app that centralizes all messages—including SMS and communications across platforms like email, Google, Facebook, Instagram, and others—into a unified inbox, helping small and medium-sized businesses better connect and engage with their customers in one place while reducing operational complexity and labor cost
· Integrated the single communication app with other software systems, including automation system, Customer Relationship Management (CRM) system, customer support system, and email system etc
· Investigated technical uncertainty related to new features, broke the feature into doable tasks and lead the team to deliver the feature by completing those tasks
· Worked collaboratively with senior team members to design solutions that resolve customer facing issues
· Fixed incorrect data in the software, upgraded the architecture system of the software and improved the stability of the software
· Migrated existing customer data from the old system to the new while ensuring the security and availability of legacy data during architecture  and system upgrades
· Actively monitored application’s health status and assisted support team in identifying and resolving customer issues as quickly as possible
· Provided valuable feedback in code review process, documented important system features and mentored junior developers
· Helped with Agile or Scrum process in the team by leading sprint retro, helping to estimate and plan sprints in PBR (Product Backlog Refinement) and showing new product features in sprint review.
Projects
Blog website
· A blog application where users can register and login to their account, publish posts, and comment on existing posts
· Completed independently in 2019 and coded using Python, JavaScript, HTML, and CSS and developed using Bootstrap as front-end framework. Using Python Flask as back-end framework, which including the Jinja2 web template engine and SQLAlchemy database
· GitHub link: https://github.com/EvanHuang7/CTWGO
· Project demo link: https://www.youtube.com/watch?v=qDDPCy3vtOc
 
Items shopping website
· A website application like Kijiji. Users can upload items they want to sell on the website and can favorite and comment on the items they are interested in
· Completed independently in 2020 and coded using PHP, JavaScript, HTML, and CSS
· GitHub link: https://github.com/EvanHuang7/Item-Shopping-website
· Project demo link: https://www.youtube.com/watch?v=HH3utaJtaF8
 
PVP Pokemon game
· A PVP Pokémon game allows two players to choose their own Pokémon to fight each other.
· Completed independently in 2020 and coded using Node.js, JavaScript, Socket.io and MySQL
· GitHub link: https://github.com/EvanHuang7/nodeJsPokemon
· Project demo link: https://www.youtube.com/watch?v=n0op8SBGiAo
 
References
 
Megan Cheesbrough  —  Vendasta 
Engineering Manager
 
306-262-6002
mcheesbrough@vendasta.com
 
 
How Chow  —  Vendasta 
Developer III
 
306-261-7150
how.chow@gmail.com

Education

Bachelor of Science - Computer Science 
May 2017 - December 2021
University of Saskatchewan
· With Great Distinction
· With 80% overall average
· Professional Internship Option
Skills

· Proficiency in different types of programming languages such as GoLang, Typescript, Python, JavaScript, Node.js, Java and PHP
· Strong ability to manage different database systems or cloud databases, including MySQL, PostgreSQL, Elasticsearch, MongoDB, Firebase, BigQuery, Google Cloud Spanner and Google Cloud Datastore
· Strong understanding with different types of frameworks, including Angular, Django, Flask, Node.js, GRPC and Bootstrap
· Knowledgeable with different types of cloud service, tools or systems, including Google Cloud Platform, Kubernetes, Docker, Cloud Pub/Sub, Google Cloud Storage, Temporal and Cadence
`

const dummyJobDescription = `About the job
We are

At Synechron, we believe in the power of digital to transform businesses for the better. Our global consulting firm combines creativity and innovative technology to deliver industry-leading digital solutions. Synechron’s progressive technologies and optimization strategies span end-to-end Artificial Intelligence, Consulting, Digital, Cloud & DevOps, Data, and Software Engineering, servicing an array of noteworthy financial services and technology firms. Through research and development initiatives in our FinLabs we develop solutions for modernization, from Artificial Intelligence and Blockchain to Data Science models, Digital Underwriting, mobile-first applications and more. Over the last 20+ years, our company has been honored with multiple employer awards, recognizing our commitment to our talented teams. With top clients to boast about, Synechron has a global workforce of 14,500+, and has 58 offices in 21 countries within key global markets.

Our challenge

We are seeking a talented and motivated DevOps Engineer with strong experience in Python scripting, Helm Charts, Tekton, and Jenkins. The ideal candidate will be responsible for automating and optimizing our development and deployment processes while ensuring the reliability and scalability of our applications.

Additional Information*

The base salary for this position will vary based on geography and other factors. In accordance with law, the base salary for this role if filled within Mississauga, ON is CAD $110k – CAD $120k/year & benefits (see below).

The Role

Responsibilities:

Design, implement, and manage CI/CD pipelines using Jenkins and Tekton. 
Develop and maintain Python scripts for automation of tasks and processes. 
Create, maintain, and manage Helm Charts for Kubernetes applications. 
Collaborate with development teams to streamline application deployment and monitoring. 
Troubleshoot and resolve issues in development, test, and production environments. 
Implement infrastructure as code (IaC) using tools like Terraform or CloudFormation. 
Monitor system performance and optimize applications for speed and efficiency. 
Ensure security best practices are followed in the deployment process. 
Document processes, systems, and configurations for internal use. 

Requirements:

8+ years of experience. 
Bachelor's degree in Computer Science, Information Technology, or a related field. 
Proven experience as a DevOps Engineer or similar role. 
Strong proficiency in Python scripting and automation. 
Experience with Helm Charts for Kubernetes deployments. 
Familiarity with Tekton for CI/CD workflows. 
Proficient in using Jenkins for continuous integration and delivery. 
Understanding of containerization technologies (Docker, Kubernetes). 
Knowledge of cloud services (AWS, Azure, GCP) is a plus. 
Strong problem-solving skills and attention to detail. 
Excellent communication and collaboration skills. 

Preferred, but not required:

Experience with configuration management tools (Ansible, Puppet, Chef). 
Knowledge of monitoring and logging tools (Prometheus, Grafana, ELK Stack). 
Familiarity with version control systems (Git, GitHub, GitLab). 

We offer:

A multinational organization with 58 offices in 21 countries and the possibility to work abroad. 
15 days (3 weeks) of paid annual leave plus an additional 10 days of personal leave (floating days and sick days). 
A comprehensive insurance plan including medical, dental, vision, life insurance, and long-term disability. 
Flexible hybrid policy. 
RRSP with employer’s contribution up to 4%. 
A higher education certification policy. 
On-demand Udemy for Business for all Synechron employees with free access to more than 5000 curated courses. 
Coaching opportunities with experienced colleagues from our Financial Innovation Labs (FinLabs) and Center of Excellences (CoE) groups. 
Cutting edge projects at the world’s leading tier-one banks, financial institutions and insurance firms. 
A truly diverse, fun-loving and global work culture. 

S YNECHRON’S DIVERSITY & INCLUSION STATEMENT

Diversity & Inclusion are fundamental to our culture, and Synechron is proud to be an equal opportunity workplace and is an affirmative action employer. Our Diversity, Equity, and Inclusion (DEI) initiative ‘Same Difference’ is committed to fostering an inclusive culture – promoting equality, diversity and an environment that is respectful to all. We strongly believe that a diverse workforce helps build stronger, successful businesses as a global company. We encourage applicants from across diverse backgrounds, race, ethnicities, religion, age, marital status, gender, sexual orientations, or disabilities to apply. We empower our global workforce by offering flexible workplace arrangements, mentoring, internal mobility, learning and development programs, and more.

All employment decisions at Synechron are based on business needs, job requirements and individual qualifications, without regard to the applicant’s gender, gender identity, sexual orientation, race, ethnicity, disabled or veteran status, or any other characteristic protected by law.`



export async function POST(request: Request) {
    const {type, role, level, techstack, amount, userid} = await request.json();

    const cleanJobDescription = sanitizeText(dummyJobDescription);
    const cleanResume = sanitizeText(dummyResume);

    try {
        const prompt = `Prepare questions for a job interview.
        Resume: ${cleanResume}
        Job Description: ${cleanJobDescription}
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        
        Thank you! <3
    `

        const {text: questions} = await generateText({
            model: google("gemini-2.0-flash-001"),
            prompt: prompt,
        });

        const interview = {
            role: role,
            type: type,
            level: level,
            techstack: techstack.split(","),
            questions: JSON.parse(questions),
            userId: userid,
            finalized: true,
            coverImage: getRandomInterviewCover(),
            createdAt: new Date().toISOString(),
            feedbacksNum: 0,
        };

        await db.collection("interviews").add(interview);

        return Response.json({success: true}, {status: 200});
    } catch (error) {
        console.error("Error:", error);
        return Response.json({success: false, error: error}, {status: 500});
    }
}

export async function GET() {
    return Response.json({success: true, data: "Thank you!"}, {status: 200});
}