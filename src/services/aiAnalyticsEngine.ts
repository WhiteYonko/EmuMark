import { Student, GradeEntry, Assessment, PerformanceInsight, PerformanceTrend, LearningGap, AIRecommendation, PerformanceAlert, SubjectPerformanceBreakdown, AIAnalyticsData } from '../types';

export class AIAnalyticsEngine {
  private students: Student[];
  private gradeEntries: GradeEntry[];
  private assessments: Assessment[];

  constructor(students: Student[], gradeEntries: GradeEntry[], assessments: Assessment[]) {
    this.students = students;
    this.gradeEntries = gradeEntries;
    this.assessments = assessments;
  }

  // Main analysis method that generates all AI insights
  public generateAnalytics(): AIAnalyticsData {
    const insights = this.generatePerformanceInsights();
    const trends = this.analyzePerformanceTrends();
    const learningGaps = this.identifyLearningGaps();
    const recommendations = this.generateRecommendations();
    const alerts = this.generatePerformanceAlerts();
    const subjectBreakdowns = this.generateSubjectBreakdowns();

    return {
      insights,
      trends,
      learningGaps,
      recommendations,
      alerts,
      subjectBreakdowns,
      lastUpdated: new Date().toISOString(),
    };
  }

  // Generate performance insights for each student
  private generatePerformanceInsights(): PerformanceInsight[] {
    const insights: PerformanceInsight[] = [];

    this.students.forEach(student => {
      const studentGrades = this.gradeEntries.filter(g => g.studentId === student.id);
      
      if (studentGrades.length === 0) return;

      // Analyze overall performance
      const averageScore = this.calculateAverageScore(studentGrades);
      const recentGrades = this.getRecentGrades(studentGrades, 30); // Last 30 days
      const recentAverage = this.calculateAverageScore(recentGrades);

      // Identify performance patterns
      if (recentAverage < averageScore - 10) {
        insights.push({
          id: `insight-${student.id}-decline-${Date.now()}`,
          studentId: student.id,
          type: 'weakness',
          category: 'academic',
          title: 'Recent Performance Decline',
          description: `${student.name} has shown a ${Math.round(averageScore - recentAverage)}% decline in recent performance.`,
          priority: 'high',
          confidence: 85,
          suggestedActions: [
            'Schedule one-on-one meeting with student',
            'Review recent assignments for patterns',
            'Consider additional support resources',
            'Contact parents for discussion'
          ],
          createdAt: new Date().toISOString(),
          isRead: false,
        });
      }

      // Identify strengths
      if (averageScore >= 90) {
        insights.push({
          id: `insight-${student.id}-strength-${Date.now()}`,
          studentId: student.id,
          type: 'strength',
          category: 'academic',
          title: 'Excellent Performance',
          description: `${student.name} is consistently performing at a high level with an average of ${Math.round(averageScore)}%.`,
          priority: 'low',
          confidence: 95,
          suggestedActions: [
            'Consider advanced materials or enrichment activities',
            'Use as peer mentor for struggling students',
            'Maintain current support level'
          ],
          createdAt: new Date().toISOString(),
          isRead: false,
        });
      }

      // Subject-specific analysis
      student.subjects.forEach(subject => {
        const subjectGrades = studentGrades.filter(g => {
          const assessment = this.assessments.find(a => a.id === g.assessmentId);
          return assessment?.subject === subject;
        });

        if (subjectGrades.length < 2) return;

        const subjectAverage = this.calculateAverageScore(subjectGrades);
        const subjectTrend = this.calculateTrend(subjectGrades);

        if (subjectAverage < 70) {
          insights.push({
            id: `insight-${student.id}-${subject}-struggling-${Date.now()}`,
            studentId: student.id,
            type: 'weakness',
            category: 'academic',
            title: `Struggling in ${subject}`,
            description: `${student.name} is struggling in ${subject} with an average of ${Math.round(subjectAverage)}%.`,
            priority: 'high',
            confidence: 90,
            suggestedActions: [
              `Provide additional ${subject} support materials`,
              'Schedule extra help sessions',
              'Consider peer tutoring',
              'Break down complex concepts into smaller parts'
            ],
            createdAt: new Date().toISOString(),
            isRead: false,
          });
        }
      });
    });

    return insights;
  }

  // Analyze performance trends over time
  private analyzePerformanceTrends(): PerformanceTrend[] {
    const trends: PerformanceTrend[] = [];

    this.students.forEach(student => {
      student.subjects.forEach(subject => {
        const subjectGrades = this.gradeEntries
          .filter(g => {
            const assessment = this.assessments.find(a => a.id === g.assessmentId);
            return assessment?.subject === subject;
          })
          .sort((a, b) => new Date(a.gradedAt).getTime() - new Date(b.gradedAt).getTime());

        if (subjectGrades.length < 3) return;

        const dataPoints = subjectGrades.map(g => ({
          date: g.gradedAt,
          score: g.percentage,
          assessmentType: this.assessments.find(a => a.id === g.assessmentId)?.type || 'unknown',
        }));

        const trend = this.calculateTrend(subjectGrades);
        const trendScore = this.calculateTrendScore(subjectGrades);
        const predictedScore = this.predictNextScore(subjectGrades);

        trends.push({
          studentId: student.id,
          subject,
          period: 'month',
          trend: this.getTrendDirection(trendScore),
          trendScore,
          dataPoints,
          predictedScore,
          confidence: this.calculateTrendConfidence(subjectGrades),
        });
      });
    });

    return trends;
  }

  // Identify learning gaps
  private identifyLearningGaps(): LearningGap[] {
    const gaps: LearningGap[] = [];

    this.students.forEach(student => {
      const studentGrades = this.gradeEntries.filter(g => g.studentId === student.id);
      
      student.subjects.forEach(subject => {
        const subjectGrades = studentGrades.filter(g => {
          const assessment = this.assessments.find(a => a.id === g.assessmentId);
          return assessment?.subject === subject;
        });

        if (subjectGrades.length === 0) return;

        const lowScores = subjectGrades.filter(g => g.percentage < 60);
        
        if (lowScores.length > 0) {
          const severity = this.determineGapSeverity(lowScores.length, subjectGrades.length);
          
          gaps.push({
            id: `gap-${student.id}-${subject}-${Date.now()}`,
            studentId: student.id,
            subject,
            topic: this.identifyWeakTopic(subject, lowScores),
            severity,
            description: `${student.name} is struggling with fundamental concepts in ${subject}.`,
            suggestedResources: this.getSuggestedResources(subject, severity),
            estimatedTimeToClose: this.estimateTimeToClose(severity),
            createdAt: new Date().toISOString(),
            status: 'open',
          });
        }
      });
    });

    return gaps;
  }

  // Generate AI recommendations for teachers
  private generateRecommendations(): AIRecommendation[] {
    const recommendations: AIRecommendation[] = [];

    // Group struggling students by subject
    const strugglingStudents = this.students.filter(student => {
      const studentGrades = this.gradeEntries.filter(g => g.studentId === student.id);
      return this.calculateAverageScore(studentGrades) < 70;
    });

    if (strugglingStudents.length > 0) {
      recommendations.push({
        id: `rec-intervention-${Date.now()}`,
        type: 'intervention',
        title: 'Implement Group Intervention Program',
        description: `${strugglingStudents.length} students are performing below 70%. Consider implementing a targeted intervention program.`,
        targetStudents: strugglingStudents.map(s => s.id),
        priority: 'high',
        estimatedImpact: 75,
        implementationSteps: [
          'Identify common learning gaps',
          'Create small group sessions',
          'Develop targeted materials',
          'Schedule regular progress checks',
          'Involve parents in the process'
        ],
        requiredResources: [
          'Additional teaching materials',
          'Small group space',
          'Progress tracking tools',
          'Parent communication templates'
        ],
        createdAt: new Date().toISOString(),
        status: 'pending',
      });
    }

    // High-performing students recommendation
    const highPerformers = this.students.filter(student => {
      const studentGrades = this.gradeEntries.filter(g => g.studentId === student.id);
      return this.calculateAverageScore(studentGrades) >= 90;
    });

    if (highPerformers.length > 0) {
      recommendations.push({
        id: `rec-enrichment-${Date.now()}`,
        type: 'teaching_strategy',
        title: 'Create Enrichment Program',
        description: `${highPerformers.length} students are excelling. Consider creating an enrichment program to challenge them further.`,
        targetStudents: highPerformers.map(s => s.id),
        priority: 'medium',
        estimatedImpact: 60,
        implementationSteps: [
          'Design advanced curriculum modules',
          'Create project-based learning opportunities',
          'Establish peer mentoring program',
          'Provide leadership opportunities'
        ],
        requiredResources: [
          'Advanced curriculum materials',
          'Project resources',
          'Mentoring guidelines',
          'Leadership training materials'
        ],
        createdAt: new Date().toISOString(),
        status: 'pending',
      });
    }

    return recommendations;
  }

  // Generate performance alerts
  private generatePerformanceAlerts(): PerformanceAlert[] {
    const alerts: PerformanceAlert[] = [];

    this.students.forEach(student => {
      const studentGrades = this.gradeEntries.filter(g => g.studentId === student.id);
      
      if (studentGrades.length === 0) return;

      const recentGrades = this.getRecentGrades(studentGrades, 7); // Last 7 days
      const recentAverage = this.calculateAverageScore(recentGrades);
      const overallAverage = this.calculateAverageScore(studentGrades);

      // Grade drop alert
      if (recentAverage < overallAverage - 15) {
        alerts.push({
          id: `alert-${student.id}-drop-${Date.now()}`,
          type: 'grade_drop',
          studentId: student.id,
          title: 'Significant Grade Drop Detected',
          message: `${student.name} has experienced a ${Math.round(overallAverage - recentAverage)}% drop in recent performance.`,
          severity: 'critical',
          createdAt: new Date().toISOString(),
          isRead: false,
          actionRequired: true,
          relatedData: {
            recentAverage,
            overallAverage,
            dropPercentage: Math.round(overallAverage - recentAverage)
          },
        });
      }

      // Missing assignments alert
      const recentAssessments = this.assessments.filter(a => {
        const dueDate = new Date(a.dueDate);
        const now = new Date();
        const daysDiff = (now.getTime() - dueDate.getTime()) / (1000 * 3600 * 24);
        return daysDiff >= 0 && daysDiff <= 7;
      });

      recentAssessments.forEach(assessment => {
        const hasGrade = studentGrades.some(g => g.assessmentId === assessment.id);
        if (!hasGrade) {
          alerts.push({
            id: `alert-${student.id}-missing-${assessment.id}`,
            type: 'missing_assignment',
            studentId: student.id,
            title: 'Missing Assignment',
            message: `${student.name} has not submitted ${assessment.title} which was due ${assessment.dueDate}.`,
            severity: 'warning',
            createdAt: new Date().toISOString(),
            isRead: false,
            actionRequired: true,
            relatedData: {
              assessmentId: assessment.id,
              dueDate: assessment.dueDate,
              daysLate: Math.floor((new Date().getTime() - new Date(assessment.dueDate).getTime()) / (1000 * 3600 * 24))
            },
          });
        }
      });
    });

    return alerts;
  }

  // Generate subject performance breakdowns
  private generateSubjectBreakdowns(): SubjectPerformanceBreakdown[] {
    const breakdowns: SubjectPerformanceBreakdown[] = [];

    this.students.forEach(student => {
      student.subjects.forEach(subject => {
        const subjectGrades = this.gradeEntries.filter(g => {
          const assessment = this.assessments.find(a => a.id === g.assessmentId);
          return assessment?.subject === subject;
        });

        if (subjectGrades.length === 0) return;

        const scores = subjectGrades.map(g => g.percentage);
        const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;

        const gradeDistribution = {
          A: scores.filter(s => s >= 90).length,
          B: scores.filter(s => s >= 80 && s < 90).length,
          C: scores.filter(s => s >= 70 && s < 80).length,
          D: scores.filter(s => s >= 60 && s < 70).length,
          F: scores.filter(s => s < 60).length,
        };

        const strugglingStudents = this.students.filter(s => {
          const sGrades = this.gradeEntries.filter(g => {
            const assessment = this.assessments.find(a => a.id === g.assessmentId);
            return assessment?.subject === subject && g.studentId === s.id;
          });
          return this.calculateAverageScore(sGrades) < 70;
        }).map(s => s.name);

        const topPerformers = this.students.filter(s => {
          const sGrades = this.gradeEntries.filter(g => {
            const assessment = this.assessments.find(a => a.id === g.assessmentId);
            return assessment?.subject === subject && g.studentId === s.id;
          });
          return this.calculateAverageScore(sGrades) >= 90;
        }).map(s => s.name);

        breakdowns.push({
          subject,
          averageScore: Math.round(averageScore),
          studentCount: this.students.filter(s => s.subjects.includes(subject)).length,
          gradeDistribution,
          topPerformers,
          strugglingStudents,
          commonWeaknesses: this.identifyCommonWeaknesses(subject, subjectGrades),
          improvementSuggestions: this.generateImprovementSuggestions(subject, averageScore),
        });
      });
    });

    return breakdowns;
  }

  // Helper methods
  private calculateAverageScore(grades: GradeEntry[]): number {
    if (grades.length === 0) return 0;
    return grades.reduce((sum, grade) => sum + grade.percentage, 0) / grades.length;
  }

  private getRecentGrades(grades: GradeEntry[], days: number): GradeEntry[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return grades.filter(grade => new Date(grade.gradedAt) >= cutoffDate);
  }

  private calculateTrend(grades: GradeEntry[]): number {
    if (grades.length < 2) return 0;
    
    const sortedGrades = grades.sort((a, b) => new Date(a.gradedAt).getTime() - new Date(b.gradedAt).getTime());
    const firstHalf = sortedGrades.slice(0, Math.floor(sortedGrades.length / 2));
    const secondHalf = sortedGrades.slice(Math.floor(sortedGrades.length / 2));
    
    const firstAverage = this.calculateAverageScore(firstHalf);
    const secondAverage = this.calculateAverageScore(secondHalf);
    
    return secondAverage - firstAverage;
  }

  private calculateTrendScore(grades: GradeEntry[]): number {
    const trend = this.calculateTrend(grades);
    return Math.max(-100, Math.min(100, trend));
  }

  private getTrendDirection(trendScore: number): 'improving' | 'declining' | 'stable' | 'volatile' {
    if (Math.abs(trendScore) < 5) return 'stable';
    if (trendScore > 10) return 'improving';
    if (trendScore < -10) return 'declining';
    return 'volatile';
  }

  private predictNextScore(grades: GradeEntry[]): number {
    if (grades.length < 3) return this.calculateAverageScore(grades);
    
    const trend = this.calculateTrend(grades);
    const currentAverage = this.calculateAverageScore(grades);
    
    return Math.max(0, Math.min(100, currentAverage + trend));
  }

  private calculateTrendConfidence(grades: GradeEntry[]): number {
    if (grades.length < 3) return 50;
    
    const scores = grades.map(g => g.percentage);
    const variance = this.calculateVariance(scores);
    const confidence = Math.max(50, 100 - variance);
    
    return Math.round(confidence);
  }

  private calculateVariance(scores: number[]): number {
    const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
    return Math.sqrt(variance);
  }

  private determineGapSeverity(lowScoreCount: number, totalCount: number): 'minor' | 'moderate' | 'major' | 'critical' {
    const percentage = (lowScoreCount / totalCount) * 100;
    
    if (percentage >= 75) return 'critical';
    if (percentage >= 50) return 'major';
    if (percentage >= 25) return 'moderate';
    return 'minor';
  }

  private identifyWeakTopic(subject: string, lowScores: GradeEntry[]): string {
    // This is a simplified implementation. In a real system, you'd analyze
    // the actual assessment content to identify specific topics.
    const topicMap: { [key: string]: string[] } = {
      'Mathematics': ['Algebra', 'Geometry', 'Arithmetic', 'Problem Solving'],
      'English': ['Reading Comprehension', 'Writing', 'Grammar', 'Vocabulary'],
      'Science': ['Biology', 'Chemistry', 'Physics', 'Scientific Method'],
      'History': ['Historical Events', 'Timeline', 'Analysis', 'Research'],
      'Geography': ['Maps', 'Climate', 'Countries', 'Physical Features'],
    };

    const topics = topicMap[subject] || ['General Concepts'];
    return topics[Math.floor(Math.random() * topics.length)];
  }

  private getSuggestedResources(subject: string, severity: 'minor' | 'moderate' | 'major' | 'critical'): string[] {
    const baseResources = [
      `${subject} practice worksheets`,
      'Online tutorial videos',
      'One-on-one tutoring sessions',
      'Peer study groups'
    ];

    if (severity === 'critical' || severity === 'major') {
      baseResources.push('Specialized intervention program', 'Parent-teacher conference');
    }

    return baseResources;
  }

  private estimateTimeToClose(severity: 'minor' | 'moderate' | 'major' | 'critical'): number {
    const timeMap = {
      'minor': 7,
      'moderate': 14,
      'major': 30,
      'critical': 60,
    };
    
    return timeMap[severity];
  }

  private identifyCommonWeaknesses(subject: string, grades: GradeEntry[]): string[] {
    // Simplified implementation - in reality, you'd analyze assessment content
    const weaknessMap: { [key: string]: string[] } = {
      'Mathematics': ['Problem-solving strategies', 'Basic arithmetic', 'Word problems'],
      'English': ['Reading comprehension', 'Essay structure', 'Grammar rules'],
      'Science': ['Scientific method', 'Data analysis', 'Concept application'],
      'History': ['Historical analysis', 'Timeline understanding', 'Source evaluation'],
      'Geography': ['Map reading', 'Climate patterns', 'Country identification'],
    };

    return weaknessMap[subject] || ['General concepts'];
  }

  private generateImprovementSuggestions(subject: string, averageScore: number): string[] {
    const suggestions = [];

    if (averageScore < 60) {
      suggestions.push('Implement intensive remediation program');
      suggestions.push('Provide additional one-on-one support');
      suggestions.push('Break down complex topics into smaller units');
    } else if (averageScore < 80) {
      suggestions.push('Increase practice opportunities');
      suggestions.push('Provide more detailed feedback');
      suggestions.push('Use visual aids and hands-on activities');
    } else {
      suggestions.push('Maintain current teaching strategies');
      suggestions.push('Consider enrichment activities');
      suggestions.push('Encourage peer tutoring');
    }

    return suggestions;
  }
}
