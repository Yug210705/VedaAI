import { Router, Request, Response } from 'express';
import { Submission } from '../models/Submission';
import { Assignment } from '../models/Assignment';
import { broadcast } from '../websocket';

const router = Router();

// Get aggregated analytics
router.get('/', async (req: Request, res: Response) => {
  try {
    const submissions = await Submission.find();
    
    // If no submissions, return empty/default state
    if (submissions.length === 0) {
      return res.json({
        totalSubmissions: 0,
        expectedSubmissions: 50,
        averageScore: 0,
        topScore: 0,
        classMedian: 0,
        lowestScore: 0,
        grades: { A: 0, B: 0, C: 0, D: 0 },
        missedConcepts: [],
        recommendedActions: []
      });
    }

    const totalSubmissions = submissions.length;
    const scores = submissions.map(s => s.score).sort((a, b) => a - b);
    const sum = scores.reduce((a, b) => a + b, 0);
    const averageScore = Math.round((sum / (totalSubmissions * submissions[0].maxScore)) * 100);
    const topScore = Math.round((scores[scores.length - 1] / submissions[0].maxScore) * 100);
    const lowestScore = Math.round((scores[0] / submissions[0].maxScore) * 100);
    
    // Median
    const mid = Math.floor(scores.length / 2);
    const classMedian = scores.length % 2 !== 0 ? scores[mid] : (scores[mid - 1] + scores[mid]) / 2;

    // Grades
    const grades = { A: 0, B: 0, C: 0, D: 0 };
    submissions.forEach(s => grades[s.grade]++);

    // Concepts frequency
    const conceptMap: Record<string, number> = {};
    submissions.forEach(s => {
      s.missedConcepts.forEach(c => {
        conceptMap[c] = (conceptMap[c] || 0) + 1;
      });
    });

    const missedConcepts = Object.entries(conceptMap)
      .map(([concept, count]) => ({
        concept,
        percentage: Math.round((count / totalSubmissions) * 100)
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5); // top 5

    // Build some dynamic recommendations based on low performers
    const recommendedActions = [];
    const lowPerformers = submissions.filter(s => s.grade === 'D').slice(0, 2);
    
    lowPerformers.forEach((s, idx) => {
      recommendedActions.push(`${s.studentName} – Needs extra help with ${s.missedConcepts[0] || 'core concepts'}.`);
    });

    if (missedConcepts.length > 0) {
      recommendedActions.push(`Revise in class : ${missedConcepts[0].concept} – Use real-life problem-solving.`);
    }
    if (grades.D > 0) {
      recommendedActions.push(`Extra classes for ${grades.D} students who scored less than D`);
    }

    res.json({
      totalSubmissions,
      expectedSubmissions: 50,
      averageScore,
      topScore,
      classMedian,
      lowestScore,
      grades,
      missedConcepts,
      recommendedActions,
      maxScore: submissions[0].maxScore
    });
  } catch (error) {
    console.error('Failed to fetch analytics', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Seed mock data
router.post('/seed', async (req: Request, res: Response) => {
  try {
    const assignment = await Assignment.findOne();
    if (!assignment) {
      return res.status(400).json({ error: 'Please create an assignment first' });
    }

    await Submission.deleteMany({}); // clear old

    const concepts = [
      "Ohm's Law Application",
      "Resistance in Parallel Circuits",
      "Potential Difference and EMF",
      "Interpreting Circuit Diagrams",
      "Series vs Parallel Circuits",
      "Concept of Power",
      "Kirchhoff's Laws"
    ];

    const studentNames = ["Simran Kaur", "Rahul Sharma", "Aisha Patel", "Vikram Singh", "Priya Desai", "Arjun Reddy", "Neha Gupta", "Karan Johar", "Ananya Pandey", "Rohan Mehra", "Meera Rajput", "Kabir Singh"];

    const mockSubmissions = [];
    const numSubmissions = Math.floor(Math.random() * 15) + 35; // 35-50 submissions

    for (let i = 0; i < numSubmissions; i++) {
      const isTop = Math.random() > 0.8;
      const isLow = Math.random() < 0.2;
      
      let score = 20;
      let grade: 'A' | 'B' | 'C' | 'D' = 'B';
      const missed = [];

      if (isTop) {
        score = Math.floor(Math.random() * 3) + 23; // 23-25
        grade = 'A';
      } else if (isLow) {
        score = Math.floor(Math.random() * 10) + 5; // 5-14
        grade = 'D';
        missed.push(concepts[Math.floor(Math.random() * concepts.length)]);
        missed.push(concepts[Math.floor(Math.random() * concepts.length)]);
      } else {
        score = Math.floor(Math.random() * 8) + 15; // 15-22
        grade = score > 19 ? 'B' : 'C';
        missed.push(concepts[Math.floor(Math.random() * concepts.length)]);
      }

      mockSubmissions.push({
        assignmentId: assignment._id,
        studentName: studentNames[i % studentNames.length] + ` ${i}`,
        score,
        maxScore: 25,
        grade,
        missedConcepts: missed
      });
    }

    await Submission.insertMany(mockSubmissions);
    
    // Broadcast websocket event
    broadcast({ type: 'analytics_updated' });

    res.json({ message: `Seeded ${numSubmissions} submissions successfully.` });
  } catch (error) {
    console.error('Failed to seed analytics', error);
    res.status(500).json({ error: 'Failed to seed analytics' });
  }
});

export default router;
