import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clean existing data for clean demo state
  await prisma.notification.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.userSettings.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Create Demo Student User
  const demoUser = await prisma.user.create({
    data: {
      name: 'Aditya Verma',
      email: 'demo@student.edu',
      passwordHash,
      role: 'STUDENT',
      college: 'Apex Institute of Technology',
      department: 'Computer Science & Engineering',
      semester: '6th Semester (B.Tech)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    },
  });

  console.log(`👤 Created Demo User: ${demoUser.email} (password: password123)`);

  // Create User Settings
  await prisma.userSettings.create({
    data: {
      userId: demoUser.id,
      emailNotifications: true,
      browserNotifications: true,
      urgentThresholdHours: 24,
      upcomingThresholdHours: 72,
      defaultPriority: 'MEDIUM',
      theme: 'dark',
    },
  });

  // 2. Create Realistic B.Tech Subjects
  const subjectsData = [
    {
      name: 'Distributed Systems & Cloud Computing',
      code: 'CS601',
      instructor: 'Dr. R. Sharma',
      color: '#3B82F6', // Blue
      department: 'Computer Science',
      semester: '6th Sem',
      description: 'Distributed consensus algorithms, microservices, containerization, and cloud orchestration.',
    },
    {
      name: 'Machine Learning & Deep Learning',
      code: 'CS602',
      instructor: 'Prof. Ananya Roy',
      color: '#8B5CF6', // Purple
      department: 'Computer Science',
      semester: '6th Sem',
      description: 'Supervised/unsupervised learning, neural network architectures, NLP, and model evaluation.',
    },
    {
      name: 'Software Engineering & Project Management',
      code: 'CS603',
      instructor: 'Dr. Vikram Mehta',
      color: '#10B981', // Emerald
      department: 'Computer Science',
      semester: '6th Sem',
      description: 'SDLC methodologies, Agile Scrum, requirements engineering, CI/CD, and QA testing.',
    },
    {
      name: 'IoT & Embedded Hardware Systems',
      code: 'EC604',
      instructor: 'Prof. S. Kulkarni',
      color: '#F59E0B', // Amber
      department: 'Electronics & CS',
      semester: '6th Sem',
      description: 'Microcontroller programming, sensor telemetry, MQTT protocols, and edge compute.',
    },
    {
      name: 'Cryptography & Network Security',
      code: 'CS605',
      instructor: 'Dr. Neha Patel',
      color: '#EC4899', // Pink
      department: 'Computer Science',
      semester: '6th Sem',
      description: 'Asymmetric cryptography, digital signatures, hash functions, and network security protocols.',
    },
    {
      name: 'B.Tech Minor Project Presentation',
      code: 'PR601',
      instructor: 'Dept. Evaluation Committee',
      color: '#06B6D4', // Cyan
      department: 'Computer Science',
      semester: '6th Sem',
      description: 'Design and end-to-end implementation of an academic web & mobile utility application.',
    },
  ];

  const createdSubjects: Record<string, any> = {};
  for (const s of subjectsData) {
    const sub = await prisma.subject.create({
      data: {
        ...s,
        userId: demoUser.id,
      },
    });
    createdSubjects[s.code] = sub;
  }
  console.log(`📚 Created ${Object.keys(createdSubjects).length} academic subjects`);

  // 3. Create Assignments with dynamic dates relative to current time
  const now = new Date();

  // Helper for date offsets
  const addHours = (hours: number) => new Date(now.getTime() + hours * 60 * 60 * 1000);
  const addDays = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  const assignmentsData = [
    {
      title: 'Kubernetes Cluster Orchestration & Helm Deployment Lab',
      description: 'Configure a multi-node Minikube cluster, deploy a 3-tier microservice with auto-scaling metrics, and write complete lab verification steps.',
      subjectId: createdSubjects['CS601'].id,
      dueDate: addHours(18), // Due in 18 hours (URGENT < 24h)
      priority: 'HIGH',
      status: 'PENDING',
      submissionType: 'LAB_RECORD',
      estimatedHours: 4.5,
      actualHours: 2.0,
      referenceUrl: 'https://kubernetes.io/docs/tutorials/hello-minikube/',
      attachmentNotes: 'Submit PDF report with terminal outputs and cluster topology diagram.',
    },
    {
      title: 'CNN Architecture for Medical Retinal Scan Classification',
      description: 'Implement a ResNet50 transfer learning model using PyTorch, analyze training loss curves, and achieve > 92% validation accuracy on Kaggle dataset.',
      subjectId: createdSubjects['CS602'].id,
      dueDate: addHours(38), // Due in 38 hours (Approaching < 48h)
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      submissionType: 'TECHNICAL_REPORT',
      estimatedHours: 6.0,
      actualHours: 3.5,
      referenceUrl: 'https://pytorch.org/tutorials/beginner/transfer_learning_tutorial.html',
      attachmentNotes: 'Include GitHub repo link and Jupyter Notebook HTML export.',
    },
    {
      title: 'Raft Consensus Protocol Simulation & Failure Recovery',
      description: 'Document leader election state transitions, log replication heartbeat timeouts, and partitioned node split-brain avoidance.',
      subjectId: createdSubjects['CS601'].id,
      dueDate: addDays(4), // Due in 4 days
      priority: 'MEDIUM',
      status: 'PENDING',
      submissionType: 'HOMEWORK',
      estimatedHours: 3.0,
      actualHours: 0,
      referenceUrl: 'https://raft.github.io/',
      attachmentNotes: 'Handwritten diagram equations accepted if scanned cleanly.',
    },
    {
      title: 'RSA Cryptosystem & Discrete Logarithm Problem Set (DPP-4)',
      description: 'Solve mathematical proofs for Fermat’s Little Theorem, Miller-Rabin primality test, and modular arithmetic key exchange calculations.',
      subjectId: createdSubjects['CS605'].id,
      dueDate: addDays(6), // Due in 6 days
      priority: 'MEDIUM',
      status: 'PENDING',
      submissionType: 'DPP',
      estimatedHours: 3.5,
      actualHours: 0,
      referenceUrl: 'https://en.wikipedia.org/wiki/RSA_(cryptosystem)',
      attachmentNotes: 'Complete questions 1 to 15 from textbook Chapter 7.',
    },
    {
      title: 'ESP32 MQTT Telemetry & Environmental Dashboard',
      description: 'Connect DHT11 temperature sensor to ESP32 board, publish JSON telemetry packets over HiveMQ broker, and plot live readings in Node-RED.',
      subjectId: createdSubjects['EC604'].id,
      dueDate: addDays(8), // Due in 8 days
      priority: 'LOW',
      status: 'IN_PROGRESS',
      submissionType: 'LAB_RECORD',
      estimatedHours: 4.0,
      actualHours: 1.5,
      referenceUrl: 'https://randomnerdtutorials.com/esp32-mqtt-publish-subscribe-arduino-ide/',
      attachmentNotes: 'Bring hardware breadboard to Friday lab for live evaluation.',
    },
    {
      title: 'Assignment Reminder App — Architecture Blueprint & Minor Defense',
      description: 'Comprehensive college project delivery: Full-stack implementation, REST APIs, Prisma ORM, Dual-Tracking dashboard, and slide deck presentation.',
      subjectId: createdSubjects['PR601'].id,
      dueDate: addDays(10),
      priority: 'HIGH',
      status: 'COMPLETED',
      submissionType: 'MINI_PROJECT',
      estimatedHours: 12.0,
      actualHours: 11.5,
      completedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      referenceUrl: 'https://github.com/academic-minor-project/assignment-reminder',
      attachmentNotes: 'Final viva slide deck and live working deployment reviewed by panel.',
    },
    {
      title: 'Software Requirements Specification (SRS) & IEEE 830 Review',
      description: 'Prepare detailed functional requirements, use case diagrams, and sequence diagrams following standard IEEE 830 documentation practices.',
      subjectId: createdSubjects['CS603'].id,
      dueDate: addDays(14),
      priority: 'MEDIUM',
      status: 'COMPLETED',
      submissionType: 'TECHNICAL_REPORT',
      estimatedHours: 5.0,
      actualHours: 4.5,
      completedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      referenceUrl: 'https://en.wikipedia.org/wiki/Software_requirements_specification',
      attachmentNotes: 'Signed off by Dr. Vikram Mehta.',
    },
    {
      title: 'Semester 5 Lab Journal & Viva Archive',
      description: 'Legacy archive submission for departmental accreditation files.',
      subjectId: createdSubjects['CS601'].id,
      dueDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // Overdue by 3 days
      priority: 'LOW',
      status: 'OVERDUE',
      submissionType: 'HOMEWORK',
      estimatedHours: 2.0,
      actualHours: 0,
      referenceUrl: '',
      attachmentNotes: 'Overdue task demonstrating dual-tracking filter and warning badge.',
    },
  ];

  const createdAssignments = [];
  for (const a of assignmentsData) {
    const item = await prisma.assignment.create({
      data: {
        ...a,
        userId: demoUser.id,
      },
    });
    createdAssignments.push(item);
  }
  console.log(`📝 Created ${createdAssignments.length} academic assignments`);

  // 4. Create In-App Notifications
  const urgentTask = createdAssignments[0];
  const approachingTask = createdAssignments[1];
  const completedTask = createdAssignments[5];
  const overdueTask = createdAssignments[7];

  await prisma.notification.createMany({
    data: [
      {
        userId: demoUser.id,
        assignmentId: urgentTask.id,
        title: '⚠️ Urgent Deadline in Less Than 24 Hours',
        message: `Your assignment "${urgentTask.title}" in ${createdSubjects['CS601'].code} is due soon! Review your submission steps now.`,
        type: 'URGENT',
        isRead: false,
        sentAt: new Date(now.getTime() - 30 * 60 * 1000), // 30 mins ago
      },
      {
        userId: demoUser.id,
        assignmentId: approachingTask.id,
        title: '⏰ Upcoming Deadline Reminder (CS602)',
        message: `"${approachingTask.title}" has an approaching deadline in 38 hours. Priority is set to HIGH.`,
        type: 'UPCOMING',
        isRead: false,
        sentAt: new Date(now.getTime() - 3 * 60 * 60 * 1000), // 3 hours ago
      },
      {
        userId: demoUser.id,
        assignmentId: completedTask.id,
        title: '🎉 Task Completed: Minor Project Blueprint',
        message: 'Great job! You finalized and archived the B.Tech minor project presentation requirements.',
        type: 'COMPLETED',
        isRead: true,
        sentAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        userId: demoUser.id,
        assignmentId: overdueTask.id,
        title: '🚨 Deadline Overdue Notice',
        message: `"${overdueTask.title}" passed its deadline. Please check with your course instructor for late submission policies.`,
        type: 'OVERDUE',
        isRead: false,
        sentAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      },
      {
        userId: demoUser.id,
        title: '🚀 Welcome to Assignment Reminder App',
        message: 'Your smart academic digital secretary is configured. Enable browser notifications to receive real-time deadline warnings.',
        type: 'SYSTEM',
        isRead: true,
        sentAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  console.log('🔔 Created realistic in-app notifications');
  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
