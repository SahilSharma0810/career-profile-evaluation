"""
MBA Readiness Scoring Orchestrator
Pure mapping-based evaluation - no OpenAI calls
"""
from typing import Dict, List, Any
from enum import Enum


class AIMaturityLevel(str, Enum):
    """AI Maturity progression levels"""
    AI_UNAWARE = "ai_unaware"
    AI_CURIOUS = "ai_curious"
    AI_CAPABLE = "ai_capable"
    AI_STRATEGIC = "ai_strategic"
    AI_NATIVE = "ai_native"


class SkillLevel(str, Enum):
    """Skill proficiency levels"""
    BEGINNER = "beginner"
    DEVELOPING = "developing"
    PROFICIENT = "proficient"
    ADVANCED = "advanced"
    EXPERT = "expert"


# Scoring weights for MBA Readiness Score
SCORING_WEIGHTS = {
    'experience': 0.20,  # 20% - Years of experience
    'role_maturity': 0.40,  # 40% - Role-specific depth
    'ai_fluency': 0.30,  # 30% - AI adoption & usage
    'ownership': 0.10  # 10% - Leadership & accountability
}


def calculate_mba_readiness_score(responses: Dict[str, Any]) -> Dict[str, Any]:
    """
    Calculate MBA Readiness Score based on quiz responses

    Returns:
        {
            'overall_score': int (0-100),
            'category_scores': dict,
            'maturity_level': str,
            'percentile': int
        }
    """
    role = responses.get('role')
    experience = responses.get('experience')

    # Calculate component scores
    experience_score = _calculate_experience_score(experience)
    role_maturity_score = _calculate_role_maturity(role, responses)
    ai_fluency_score = _calculate_ai_fluency(role, responses)
    ownership_score = _calculate_ownership(role, responses)

    # Calculate raw weighted score (0-100)
    raw_score = (
        experience_score * SCORING_WEIGHTS['experience'] +
        role_maturity_score * SCORING_WEIGHTS['role_maturity'] +
        ai_fluency_score * SCORING_WEIGHTS['ai_fluency'] +
        ownership_score * SCORING_WEIGHTS['ownership']
    )

    # Cap score at 40-80% range (nobody is "perfect", everyone has room to grow)
    # Map raw 0-100 score to 40-80 range
    overall_score = int(40 + (raw_score * 0.40))
    overall_score = max(40, min(80, overall_score))  # Ensure bounds

    # Determine AI maturity level (use raw score for better differentiation)
    maturity_level = _determine_ai_maturity(ai_fluency_score, raw_score)

    # Calculate percentile (simplified - in production, query database)
    percentile = _calculate_percentile(overall_score)

    return {
        'overall_score': overall_score,
        'category_scores': {
            'experience': experience_score,
            'role_maturity': role_maturity_score,
            'ai_fluency': ai_fluency_score,
            'ownership': ownership_score
        },
        'maturity_level': maturity_level,
        'percentile': percentile,
        'readiness_tags': _generate_readiness_tags(overall_score, maturity_level, role, responses)
    }


def _calculate_experience_score(experience: str) -> int:
    """Map experience to score (0-100)"""
    experience_map = {
        '0-2': 40,
        '2-5': 60,
        '5-8': 80,
        '8-12': 95,
        '12+': 100
    }
    return experience_map.get(experience, 50)


def _calculate_role_maturity(role: str, responses: Dict[str, Any]) -> int:
    """
    Calculate role-specific maturity based on answer patterns
    Higher scores for strategic/systems thinking answers
    """
    if role == 'product-manager':
        return _score_pm_maturity(responses)
    elif role == 'finance':
        return _score_finance_maturity(responses)
    elif role == 'sales':
        return _score_sales_maturity(responses)
    elif role == 'marketing':
        return _score_marketing_maturity(responses)
    elif role == 'operations':
        return _score_operations_maturity(responses)
    elif role == 'founder':
        return _score_founder_maturity(responses)
    elif role == 'tech':
        return _score_tech_maturity(responses)
    else:
        return 50  # Default for student/other


def _score_pm_maturity(responses: Dict[str, Any]) -> int:
    """Score PM based on strategic depth - experience-based questions"""
    from .mba_skill_scoring_maps import ANSWER_SCORES
    
    score = 50  # Base score
    experience = responses.get('experience', '')
    
    # Map experience to level
    experience_level = _map_experience_to_level(experience)
    
    # Score based on experience level
    if experience_level == '0-3':
        # Entry level questions (PM-E1 to PM-E6)
        # Exclude E4 (ownership) and E5 (AI) as they're used in separate calculations
        questions = ['pm-e1', 'pm-e2', 'pm-e3', 'pm-e6']
        for q_key in questions:
            answer = responses.get(q_key)
            if answer and q_key in ANSWER_SCORES:
                answer_score = ANSWER_SCORES[q_key].get(answer, 0)
                # Convert 1-5 score to maturity points (max 10 points per question)
                score += (answer_score - 1) * 2.5  # 1→0, 2→2.5, 3→5, 4→7.5, 5→10
    
    elif experience_level == '3-8':
        # Mid level questions (PM-M1 to PM-M6)
        # Exclude M3 (AI) and M4 (ownership) as they're used in separate calculations
        questions = ['pm-m1', 'pm-m2', 'pm-m5', 'pm-m6']
        for q_key in questions:
            answer = responses.get(q_key)
            if answer and q_key in ANSWER_SCORES:
                answer_score = ANSWER_SCORES[q_key].get(answer, 0)
                score += (answer_score - 1) * 2.5
    
    elif experience_level == '8+':
        # Senior level questions (PM-S1 to PM-S6)
        # Exclude S1 (AI) and S3 (ownership) as they're used in separate calculations
        questions = ['pm-s2', 'pm-s4', 'pm-s5', 'pm-s6']
        for q_key in questions:
            answer = responses.get(q_key)
            if answer and q_key in ANSWER_SCORES:
                answer_score = ANSWER_SCORES[q_key].get(answer, 0)
                score += (answer_score - 1) * 2.5
    
    return min(score, 100)


def _map_experience_to_level(experience: str) -> str:
    """Map experience string to level (0-3, 3-8, 8+)"""
    if experience in ['0-1', '1-3', '0-2', '2-5']:
        return '0-3'
    elif experience in ['3-6', '6-10', '5-8', '8-12']:
        return '3-8'
    elif experience in ['10+', '12+']:
        return '8+'
    else:
        # Default to mid-level if unknown
        return '3-8'


def _score_finance_maturity(responses: Dict[str, Any]) -> int:
    """Score Finance based on strategic depth - experience-based questions"""
    from .mba_skill_scoring_maps import ANSWER_SCORES
    
    score = 50  # Base score
    experience = responses.get('experience', '')
    
    # Map experience to level
    experience_level = _map_experience_to_level(experience)
    
    # Score based on experience level
    if experience_level == '0-3':
        # Entry level questions (FM-E1 to FM-E6)
        # Exclude E4 (AI) and E6 (ownership) as they're used in separate calculations
        questions = ['fm-e1', 'fm-e2', 'fm-e3', 'fm-e5']
        for q_key in questions:
            answer = responses.get(q_key)
            if answer and q_key in ANSWER_SCORES:
                answer_score = ANSWER_SCORES[q_key].get(answer, 0)
                # Convert 1-5 score to maturity points (max 10 points per question)
                score += (answer_score - 1) * 2.5  # 1→0, 2→2.5, 3→5, 4→7.5, 5→10
    
    elif experience_level == '3-8':
        # Mid level questions (FM-M1 to FM-M6)
        # Exclude M5 (AI) and M6 (ownership) as they're used in separate calculations
        questions = ['fm-m1', 'fm-m2', 'fm-m3', 'fm-m4']
        for q_key in questions:
            answer = responses.get(q_key)
            if answer and q_key in ANSWER_SCORES:
                answer_score = ANSWER_SCORES[q_key].get(answer, 0)
                score += (answer_score - 1) * 2.5
    
    elif experience_level == '8+':
        # Senior level questions (FM-S1 to FM-S6)
        # Exclude S3 (AI) and S4 (ownership) as they're used in separate calculations
        questions = ['fm-s1', 'fm-s2', 'fm-s5', 'fm-s6']
        for q_key in questions:
            answer = responses.get(q_key)
            if answer and q_key in ANSWER_SCORES:
                answer_score = ANSWER_SCORES[q_key].get(answer, 0)
                score += (answer_score - 1) * 2.5
    
    return min(score, 100)


def _score_sales_maturity(responses: Dict[str, Any]) -> int:
    """Score Sales based on strategic depth - experience-based questions"""
    from .mba_skill_scoring_maps import ANSWER_SCORES
    
    score = 50  # Base score
    experience = responses.get('experience', '')
    
    # Map experience to level
    experience_level = _map_experience_to_level(experience)
    
    # Score based on experience level
    if experience_level == '0-3':
        # Entry level questions (SM-E1 to SM-E6)
        # Exclude E4 (AI) and E5 (ownership) as they're used in separate calculations
        questions = ['sm-e1', 'sm-e2', 'sm-e3', 'sm-e6']
        for q_key in questions:
            answer = responses.get(q_key)
            if answer and q_key in ANSWER_SCORES:
                answer_score = ANSWER_SCORES[q_key].get(answer, 0)
                # Convert 1-5 score to maturity points (max 10 points per question)
                score += (answer_score - 1) * 2.5  # 1→0, 2→2.5, 3→5, 4→7.5, 5→10
    
    elif experience_level == '3-8':
        # Mid level questions (SM-M1 to SM-M6)
        # Exclude M4 (AI) and M5 (ownership) as they're used in separate calculations
        questions = ['sm-m1', 'sm-m2', 'sm-m3', 'sm-m6']
        for q_key in questions:
            answer = responses.get(q_key)
            if answer and q_key in ANSWER_SCORES:
                answer_score = ANSWER_SCORES[q_key].get(answer, 0)
                score += (answer_score - 1) * 2.5
    
    elif experience_level == '8+':
        # Senior level questions (SM-S1 to SM-S6)
        # Exclude S4 (AI) and S5 (ownership) as they're used in separate calculations
        questions = ['sm-s1', 'sm-s2', 'sm-s3', 'sm-s6']
        for q_key in questions:
            answer = responses.get(q_key)
            if answer and q_key in ANSWER_SCORES:
                answer_score = ANSWER_SCORES[q_key].get(answer, 0)
                score += (answer_score - 1) * 2.5
    
    return min(score, 100)


def _score_marketing_maturity(responses: Dict[str, Any]) -> int:
    """Score Marketing based on strategic depth - experience-based questions"""
    from .mba_skill_scoring_maps import ANSWER_SCORES
    
    score = 50  # Base score
    experience = responses.get('experience', '')
    
    # Map experience to level
    experience_level = _map_experience_to_level(experience)
    
    # Score based on experience level
    if experience_level == '0-3':
        # Entry level questions (MM-E1 to MM-E6)
        # Exclude E4 (AI) and E6 (ownership) as they're used in separate calculations
        questions = ['mm-e1', 'mm-e2', 'mm-e3', 'mm-e5']
        for q_key in questions:
            answer = responses.get(q_key)
            if answer and q_key in ANSWER_SCORES:
                answer_score = ANSWER_SCORES[q_key].get(answer, 0)
                # Convert 1-5 score to maturity points (max 10 points per question)
                score += (answer_score - 1) * 2.5  # 1→0, 2→2.5, 3→5, 4→7.5, 5→10
    
    elif experience_level == '3-8':
        # Mid level questions (MM-M1 to MM-M6)
        # Exclude M4 (AI) and M6 (ownership) as they're used in separate calculations
        questions = ['mm-m1', 'mm-m2', 'mm-m3', 'mm-m5']
        for q_key in questions:
            answer = responses.get(q_key)
            if answer and q_key in ANSWER_SCORES:
                answer_score = ANSWER_SCORES[q_key].get(answer, 0)
                score += (answer_score - 1) * 2.5
    
    elif experience_level == '8+':
        # Senior level questions (MM-S1 to MM-S6)
        # Exclude S4 (AI) and S6 (ownership) as they're used in separate calculations
        questions = ['mm-s1', 'mm-s2', 'mm-s3', 'mm-s5']
        for q_key in questions:
            answer = responses.get(q_key)
            if answer and q_key in ANSWER_SCORES:
                answer_score = ANSWER_SCORES[q_key].get(answer, 0)
                score += (answer_score - 1) * 2.5
    
    return min(score, 100)


def _score_operations_maturity(responses: Dict[str, Any]) -> int:
    """Score Operations based on strategic depth - experience-based questions"""
    from .mba_skill_scoring_maps import ANSWER_SCORES
    
    score = 50  # Base score
    experience = responses.get('experience', '')
    
    # Map experience to level
    experience_level = _map_experience_to_level(experience)
    
    # Score based on experience level
    if experience_level == '0-3':
        # Entry level questions (OM-E1 to OM-E6)
        # Exclude E5 (AI) and E6 (ownership) as they're used in separate calculations
        questions = ['om-e1', 'om-e2', 'om-e3', 'om-e4']
        for q_key in questions:
            answer = responses.get(q_key)
            if answer and q_key in ANSWER_SCORES:
                answer_score = ANSWER_SCORES[q_key].get(answer, 0)
                # Convert 1-5 score to maturity points (max 10 points per question)
                score += (answer_score - 1) * 2.5  # 1→0, 2→2.5, 3→5, 4→7.5, 5→10
    
    elif experience_level == '3-8':
        # Mid level questions (OM-M1 to OM-M6)
        # Exclude M4 (AI) and M6 (ownership) as they're used in separate calculations
        questions = ['om-m1', 'om-m2', 'om-m3', 'om-m5']
        for q_key in questions:
            answer = responses.get(q_key)
            if answer and q_key in ANSWER_SCORES:
                answer_score = ANSWER_SCORES[q_key].get(answer, 0)
                score += (answer_score - 1) * 2.5
    
    elif experience_level == '8+':
        # Senior level questions (OM-S1 to OM-S6)
        # Exclude S3 (AI) and S4 (ownership) as they're used in separate calculations
        questions = ['om-s1', 'om-s2', 'om-s5', 'om-s6']
        for q_key in questions:
            answer = responses.get(q_key)
            if answer and q_key in ANSWER_SCORES:
                answer_score = ANSWER_SCORES[q_key].get(answer, 0)
                score += (answer_score - 1) * 2.5
    
    return min(score, 100)


def _score_founder_maturity(responses: Dict[str, Any]) -> int:
    """Score Founder based on strategic depth - experience-based questions"""
    from .mba_skill_scoring_maps import ANSWER_SCORES
    
    score = 50  # Base score
    experience = responses.get('experience', '')
    
    # Map experience to level
    experience_level = _map_experience_to_level(experience)
    
    # Score based on experience level
    if experience_level == '0-3':
        # Entry level questions (SF-E1 to SF-E6)
        # Exclude E5 (AI) and E6 (ownership) as they're used in separate calculations
        questions = ['sf-e1', 'sf-e2', 'sf-e3', 'sf-e4']
        for q_key in questions:
            answer = responses.get(q_key)
            if answer and q_key in ANSWER_SCORES:
                answer_score = ANSWER_SCORES[q_key].get(answer, 0)
                # Convert 1-4 score to maturity points (max 10 points per question)
                score += (answer_score - 1) * 3.33  # 1→0, 2→3.33, 3→6.67, 4→10
    elif experience_level == '3-8':
        # Mid level questions (SF-M1 to SF-M6)
        # Exclude M3 (ownership) and M5 (AI) as they're used in separate calculations
        questions = ['sf-m1', 'sf-m2', 'sf-m4', 'sf-m6']
        for q_key in questions:
            answer = responses.get(q_key)
            if answer and q_key in ANSWER_SCORES:
                answer_score = ANSWER_SCORES[q_key].get(answer, 0)
                score += (answer_score - 1) * 3.33
    elif experience_level == '8+':
        # Senior level questions (SF-S1 to SF-S6)
        # Exclude S3 (ownership) and S5 (AI) as they're used in separate calculations
        questions = ['sf-s1', 'sf-s2', 'sf-s4', 'sf-s6']
        for q_key in questions:
            answer = responses.get(q_key)
            if answer and q_key in ANSWER_SCORES:
                answer_score = ANSWER_SCORES[q_key].get(answer, 0)
                score += (answer_score - 1) * 3.33
    
    return min(score, 100)


def _score_tech_maturity(responses: Dict[str, Any]) -> int:
    """Score Tech/Engineering based on strategic depth - experience-based questions"""
    from .mba_skill_scoring_maps import ANSWER_SCORES
    
    score = 50  # Base score
    experience = responses.get('experience', '')
    
    # Map experience to level
    experience_level = _map_experience_to_level(experience)
    
    # Score based on experience level
    if experience_level == '0-3':
        # Entry level questions (TM-E1 to TM-E6)
        # Exclude E5 (AI) and E6 (ownership) as they're used in separate calculations
        questions = ['tm-e1', 'tm-e2', 'tm-e3', 'tm-e4']
        for q_key in questions:
            answer = responses.get(q_key)
            if answer and q_key in ANSWER_SCORES:
                answer_score = ANSWER_SCORES[q_key].get(answer, 0)
                # Convert 1-5 score to maturity points (max 10 points per question)
                score += (answer_score - 1) * 2.5  # 1→0, 2→2.5, 3→5, 4→7.5, 5→10
    
    elif experience_level == '3-8':
        # Mid level questions (TM-M1 to TM-M6)
        # Exclude M4 (ownership) and M5 (AI) as they're used in separate calculations
        questions = ['tm-m1', 'tm-m2', 'tm-m3', 'tm-m6']
        for q_key in questions:
            answer = responses.get(q_key)
            if answer and q_key in ANSWER_SCORES:
                answer_score = ANSWER_SCORES[q_key].get(answer, 0)
                score += (answer_score - 1) * 2.5
    
    elif experience_level == '8+':
        # Senior level questions (TM-S1 to TM-S6)
        # Exclude S4 (ownership) and S5 (AI) as they're used in separate calculations
        questions = ['tm-s1', 'tm-s2', 'tm-s3', 'tm-s6']
        for q_key in questions:
            answer = responses.get(q_key)
            if answer and q_key in ANSWER_SCORES:
                answer_score = ANSWER_SCORES[q_key].get(answer, 0)
                score += (answer_score - 1) * 2.5
    
    return min(score, 100)


def _calculate_ai_fluency(role: str, responses: Dict[str, Any]) -> int:
    """Calculate AI fluency score based on AI-related answers"""
    from .mba_skill_scoring_maps import ANSWER_SCORES
    
    score = 30  # Base score (everyone has some AI exposure)

    if role == 'product-manager':
        # PM uses experience-based AI questions
        experience = responses.get('experience', '')
        experience_level = _map_experience_to_level(experience)
        
        # Map to correct AI question based on experience
        ai_question_map = {
            '0-3': 'pm-e5',  # AI in Workflow
            '3-8': 'pm-m3',  # North Star Alignment (used for AI fluency per markdown)
            '8+': 'pm-s1'    # Revenue Doubling Mandate (used for AI fluency per markdown)
        }
        
        ai_key = ai_question_map.get(experience_level)
        if ai_key:
            ai_answer = responses.get(ai_key)
            if ai_answer and ai_key in ANSWER_SCORES:
                answer_score = ANSWER_SCORES[ai_key].get(ai_answer, 0)
                # Convert 1-5 score to AI fluency points
                # 1→+10, 2→+20, 3→+30, 4→+40, 5→+50
                score += (answer_score - 1) * 10 + 10
    elif role == 'finance':
        # Finance uses experience-based AI questions
        experience = responses.get('experience', '')
        experience_level = _map_experience_to_level(experience)
        
        # Map to correct AI question based on experience
        ai_question_map = {
            '0-3': 'fm-e4',  # Automating Reporting
            '3-8': 'fm-m5',  # Leveraging AI in Finance
            '8+': 'fm-s3'    # Leading Finance Transformation
        }
        
        ai_key = ai_question_map.get(experience_level)
        if ai_key:
            ai_answer = responses.get(ai_key)
            if ai_answer and ai_key in ANSWER_SCORES:
                answer_score = ANSWER_SCORES[ai_key].get(ai_answer, 0)
                # Convert 1-5 score to AI fluency points
                # 1→+10, 2→+20, 3→+30, 4→+40, 5→+50
                score += (answer_score - 1) * 10 + 10
    elif role == 'sales':
        # Sales uses experience-based AI questions
        experience = responses.get('experience', '')
        experience_level = _map_experience_to_level(experience)
        
        # Map to correct AI question based on experience
        ai_question_map = {
            '0-3': 'sm-e4',  # Repetitive Manual Reporting
            '3-8': 'sm-m4',  # AI in Prospecting
            '8+': 'sm-s4'    # AI-Driven Sales Transformation
        }
        
        ai_key = ai_question_map.get(experience_level)
        if ai_key:
            ai_answer = responses.get(ai_key)
            if ai_answer and ai_key in ANSWER_SCORES:
                answer_score = ANSWER_SCORES[ai_key].get(ai_answer, 0)
                # Convert 1-5 score to AI fluency points
                # 1→+10, 2→+20, 3→+30, 4→+40, 5→+50
                score += (answer_score - 1) * 10 + 10
    elif role == 'marketing':
        # Marketing uses experience-based AI questions
        experience = responses.get('experience', '')
        experience_level = _map_experience_to_level(experience)
        
        # Map to correct AI question based on experience
        ai_question_map = {
            '0-3': 'mm-e4',  # Manual Performance Reporting
            '3-8': 'mm-m4',  # AI in Creative Optimization
            '8+': 'mm-s4'    # AI-Led Marketing Transformation
        }
        
        ai_key = ai_question_map.get(experience_level)
        if ai_key:
            ai_answer = responses.get(ai_key)
            if ai_answer and ai_key in ANSWER_SCORES:
                answer_score = ANSWER_SCORES[ai_key].get(ai_answer, 0)
                # Convert 1-5 score to AI fluency points
                # 1→+10, 2→+20, 3→+30, 4→+40, 5→+50
                score += (answer_score - 1) * 10 + 10
    elif role == 'operations':
        # Operations uses experience-based AI questions
        experience = responses.get('experience', '')
        experience_level = _map_experience_to_level(experience)
        
        # Map to correct AI question based on experience
        ai_question_map = {
            '0-3': 'om-e5',  # Using AI in Operations
            '3-8': 'om-m4',  # Automation Opportunity
            '8+': 'om-s3'    # Enterprise Automation Roadmap
        }
        
        ai_key = ai_question_map.get(experience_level)
        if ai_key:
            ai_answer = responses.get(ai_key)
            if ai_answer and ai_key in ANSWER_SCORES:
                answer_score = ANSWER_SCORES[ai_key].get(ai_answer, 0)
                # Convert 1-5 score to AI fluency points
                # 1→+10, 2→+20, 3→+30, 4→+40, 5→+50
                score += (answer_score - 1) * 10 + 10
    elif role == 'founder':
        # Founder uses experience-based AI questions
        experience = responses.get('experience', '')
        experience_level = _map_experience_to_level(experience)
        
        # Map to correct AI question based on experience
        ai_question_map = {
            '0-3': 'sf-e5',  # Using AI in Early Startup
            '3-8': 'sf-m5',  # Leveraging AI for Scale
            '8+': 'sf-s5'    # AI-Driven Business Reinvention
        }
        
        ai_key = ai_question_map.get(experience_level)
        if ai_key:
            ai_answer = responses.get(ai_key)
            if ai_answer and ai_key in ANSWER_SCORES:
                answer_score = ANSWER_SCORES[ai_key].get(ai_answer, 0)
                # Convert 1-4 score to AI fluency points
                # 1→+10, 2→+20, 3→+30, 4→+40
                score += (answer_score - 1) * 10 + 10
    elif role == 'tech':
        # Tech uses experience-based AI questions
        experience = responses.get('experience', '')
        experience_level = _map_experience_to_level(experience)
        
        # Map to correct AI question based on experience
        ai_question_map = {
            '0-3': 'tm-e5',  # TM-E5: AI Literacy (Business Context)
            '3-8': 'tm-m5',  # TM-M5: AI Investment Decision
            '8+': 'tm-s5'    # TM-S5: AI as Strategy
        }
        
        ai_key = ai_question_map.get(experience_level)
        if ai_key:
            ai_answer = responses.get(ai_key)
            if ai_answer and ai_key in ANSWER_SCORES:
                answer_score = ANSWER_SCORES[ai_key].get(ai_answer, 0)
                # Convert 1-5 score to AI fluency points
                # 1→+10, 2→+20, 3→+30, 4→+40, 5→+50
                score += (answer_score - 1) * 10 + 10

    return min(score, 100)


def _calculate_ownership(role: str, responses: Dict[str, Any]) -> int:
    """Calculate ownership/leadership score"""
    from .mba_skill_scoring_maps import ANSWER_SCORES
    
    score = 50  # Base score

    if role == 'product-manager':
        # PM uses experience-based ownership questions
        experience = responses.get('experience', '')
        experience_level = _map_experience_to_level(experience)
        
        # Map to correct ownership question based on experience
        ownership_question_map = {
            '0-3': 'pm-e4',  # Success Measurement (used for ownership per markdown)
            '3-8': 'pm-m4',  # AI Feature Pressure (used for ownership per markdown)
            '8+': 'pm-s3'    # AI as Moat (used for ownership per markdown)
        }
        
        ownership_key = ownership_question_map.get(experience_level)
        if ownership_key:
            ownership_answer = responses.get(ownership_key)
            if ownership_answer and ownership_key in ANSWER_SCORES:
                answer_score = ANSWER_SCORES[ownership_key].get(ownership_answer, 0)
                # Convert 1-5 score to ownership points
                # 1→+10, 2→+20, 3→+30, 4→+40, 5→+50
                score += (answer_score - 1) * 10 + 10
    elif role == 'finance':
        # Finance uses experience-based ownership questions
        experience = responses.get('experience', '')
        experience_level = _map_experience_to_level(experience)
        
        # Map to correct ownership question based on experience
        ownership_question_map = {
            '0-3': 'fm-e6',  # Cross-functional Planning Meeting
            '3-8': 'fm-m6',  # Influencing Senior Leaders
            '8+': 'fm-s4'    # Managing Board-Level Reporting
        }
        
        ownership_key = ownership_question_map.get(experience_level)
        if ownership_key:
            ownership_answer = responses.get(ownership_key)
            if ownership_answer and ownership_key in ANSWER_SCORES:
                answer_score = ANSWER_SCORES[ownership_key].get(ownership_answer, 0)
                # Convert 1-5 score to ownership points
                # 1→+10, 2→+20, 3→+30, 4→+40, 5→+50
                score += (answer_score - 1) * 10 + 10
    elif role == 'sales':
        # Sales uses experience-based ownership questions
        experience = responses.get('experience', '')
        experience_level = _map_experience_to_level(experience)
        
        # Map to correct ownership question based on experience
        ownership_question_map = {
            '0-3': 'sm-e5',  # Pricing Pushback
            '3-8': 'sm-m5',  # Declining Win Rate
            '8+': 'sm-s5'    # Board-Level Revenue Forecast
        }
        
        ownership_key = ownership_question_map.get(experience_level)
        if ownership_key:
            ownership_answer = responses.get(ownership_key)
            if ownership_answer and ownership_key in ANSWER_SCORES:
                answer_score = ANSWER_SCORES[ownership_key].get(ownership_answer, 0)
                # Convert 1-5 score to ownership points
                # 1→+10, 2→+20, 3→+30, 4→+40, 5→+50
                score += (answer_score - 1) * 10 + 10
    elif role == 'marketing':
        # Marketing uses experience-based ownership questions
        experience = responses.get('experience', '')
        experience_level = _map_experience_to_level(experience)
        
        # Map to correct ownership question based on experience
        ownership_question_map = {
            '0-3': 'mm-e6',  # Marketing-Sales Misalignment
            '3-8': 'mm-m6',  # Leading a Performance Team
            '8+': 'mm-s6'    # Building a High-Performance Marketing Org
        }
        
        ownership_key = ownership_question_map.get(experience_level)
        if ownership_key:
            ownership_answer = responses.get(ownership_key)
            if ownership_answer and ownership_key in ANSWER_SCORES:
                answer_score = ANSWER_SCORES[ownership_key].get(ownership_answer, 0)
                # Convert 1-5 score to ownership points
                # 1→+10, 2→+20, 3→+30, 4→+40, 5→+50
                score += (answer_score - 1) * 10 + 10
    elif role == 'operations':
        # Operations uses experience-based ownership questions
        experience = responses.get('experience', '')
        experience_level = _map_experience_to_level(experience)
        
        # Map to correct ownership question based on experience
        ownership_question_map = {
            '0-3': 'om-e6',  # Cross-Team Process Breakdown
            '3-8': 'om-m6',  # Managing Cross-Functional Execution
            '8+': 'om-s4'    # Board-Level Performance Challenge
        }
        
        ownership_key = ownership_question_map.get(experience_level)
        if ownership_key:
            ownership_answer = responses.get(ownership_key)
            if ownership_answer and ownership_key in ANSWER_SCORES:
                answer_score = ANSWER_SCORES[ownership_key].get(ownership_answer, 0)
                # Convert 1-5 score to ownership points
                # 1→+10, 2→+20, 3→+30, 4→+40, 5→+50
                score += (answer_score - 1) * 10 + 10
    elif role == 'founder':
        # Founder uses experience-based ownership questions
        experience = responses.get('experience', '')
        experience_level = _map_experience_to_level(experience)
        
        # Map to correct ownership question based on experience
        ownership_question_map = {
            '0-3': 'sf-e6',  # Co-Founder Conflict
            '3-8': 'sf-m3',  # Hiring Leadership Team
            '8+': 'sf-s3'    # Enterprise Governance & Scale
        }
        
        ownership_key = ownership_question_map.get(experience_level)
        if ownership_key:
            ownership_answer = responses.get(ownership_key)
            if ownership_answer and ownership_key in ANSWER_SCORES:
                answer_score = ANSWER_SCORES[ownership_key].get(ownership_answer, 0)
                # Convert 1-4 score to ownership points
                # 1→+10, 2→+20, 3→+30, 4→+40
                score += (answer_score - 1) * 10 + 10
    elif role == 'tech':
        # Tech uses experience-based ownership questions
        experience = responses.get('experience', '')
        experience_level = _map_experience_to_level(experience)
        
        # Map to correct ownership question based on experience
        ownership_question_map = {
            '0-3': 'tm-e6',  # TM-E6: Ownership Mindset
            '3-8': 'tm-m4',  # TM-M4: Tech Debt vs Speed
            '8+': 'tm-s4'    # TM-S4: Long-Term Scalability
        }
        
        ownership_key = ownership_question_map.get(experience_level)
        if ownership_key:
            ownership_answer = responses.get(ownership_key)
            if ownership_answer and ownership_key in ANSWER_SCORES:
                answer_score = ANSWER_SCORES[ownership_key].get(ownership_answer, 0)
                # Convert 1-5 score to ownership points
                # 1→+10, 2→+20, 3→+30, 4→+40, 5→+50
                score += (answer_score - 1) * 10 + 10

    return min(score, 100)


def _determine_ai_maturity(ai_fluency: int, overall_score: int) -> str:
    """Determine AI maturity level"""
    if ai_fluency >= 80 and overall_score >= 75:
        return AIMaturityLevel.AI_NATIVE
    elif ai_fluency >= 65:
        return AIMaturityLevel.AI_STRATEGIC
    elif ai_fluency >= 45:
        return AIMaturityLevel.AI_CAPABLE
    elif ai_fluency >= 30:
        return AIMaturityLevel.AI_CURIOUS
    else:
        return AIMaturityLevel.AI_UNAWARE


def _calculate_percentile(overall_score: int) -> int:
    """
    Calculate percentile based on score (capped at 40-80% range)
    In production, this would query actual user data
    """
    # Adjusted for 40-80% score range
    if overall_score >= 75:  # Top tier (75-80%)
        return 85
    elif overall_score >= 70:
        return 75
    elif overall_score >= 65:
        return 65
    elif overall_score >= 60:
        return 55
    elif overall_score >= 55:
        return 50
    elif overall_score >= 50:
        return 40
    elif overall_score >= 45:
        return 30
    else:  # 40-44%
        return 20


def _generate_readiness_tags(score: int, maturity: str, role: str, responses: Dict[str, Any]) -> List[str]:
    """
    Generate descriptive tags based on actual quiz responses
    Tags should reflect user's specific strengths, not generic role labels
    """
    tags = []

    # Response-specific tags (max 2-3 based on answer patterns)
    if role == 'product-manager':
        experience = responses.get('experience', '')
        experience_level = _map_experience_to_level(experience)
        
        if experience_level == '0-3':
            # Entry level tags
            if responses.get('pm-e1') == 'break-down-funnel':
                tags.append("Data-Driven")
            if responses.get('pm-e2') == 'interview-churned':
                tags.append("User-Centric")
            if responses.get('pm-e3') == 'scoring-framework':
                tags.append("Structured Thinker")
            if responses.get('pm-e5') in ['auto-summarize', 'generate-prd']:
                tags.append("AI-Powered PM")
            if responses.get('pm-e6') == 'segment-analyze':
                tags.append("Strategic Analyst")
        
        elif experience_level == '3-8':
            # Mid level tags
            if responses.get('pm-m1') == 'ltv-analysis':
                tags.append("Strategic PM")
            if responses.get('pm-m2') == 'quantify-phased':
                tags.append("Leadership")
            if responses.get('pm-m5') == 'churned-analysis':
                tags.append("Data-Driven")
            if responses.get('pm-m6') == 'weak-discovery':
                tags.append("Self-Aware")
            if responses.get('pm-m3') == 'north-star-metric':
                tags.append("Strategic Thinker")
        
        elif experience_level == '8+':
            # Senior level tags
            if responses.get('pm-s1') == 'identify-ltv-icp':
                tags.append("Portfolio Strategist")
            if responses.get('pm-s2') == 'reevaluate-fit':
                tags.append("Capital Allocator")
            if responses.get('pm-s3') == 'proprietary-data':
                tags.append("AI Strategist")
            if responses.get('pm-s4') == 'lack-ownership':
                tags.append("Organizational Leader")
            if responses.get('pm-s5') == 'core-competency':
                tags.append("Strategic Thinker")
            if responses.get('pm-s6') == 'market-timing':
                tags.append("Strategic Visionary")

    elif role == 'finance':
        experience = responses.get('experience', '')
        experience_level = _map_experience_to_level(experience)
        
        if experience_level == '0-3':
            # Entry level tags
            if responses.get('fm-e1') == 'revisit-assumptions':
                tags.append("Analytical Thinker")
            if responses.get('fm-e2') == 'share-model-scenarios':
                tags.append("Business Partner")
            if responses.get('fm-e3') == 'trace-reconcile':
                tags.append("Data Integrity Focused")
            if responses.get('fm-e4') == 'explore-automation':
                tags.append("AI-Adopter")
            if responses.get('fm-e5') == 'analyze-roi-strategic':
                tags.append("Strategic Analyst")
            if responses.get('fm-e6') == 'facilitate-data-scenarios':
                tags.append("Leadership Potential")
        
        elif experience_level == '3-8':
            # Mid level tags
            if responses.get('fm-m1') == 'driver-based-scenarios':
                tags.append("Advanced Modeler")
            if responses.get('fm-m2') == 'build-business-case':
                tags.append("Strategic Partner")
            if responses.get('fm-m3') == 'scenarios-sensitivity':
                tags.append("Strategic Planner")
            if responses.get('fm-m4') == 'validation-reconciliation':
                tags.append("Process Excellence")
            if responses.get('fm-m5') == 'ai-validate-outputs':
                tags.append("AI-Capable")
            if responses.get('fm-m6') == 'present-scenarios-risk':
                tags.append("Executive Influencer")
        
        elif experience_level == '8+':
            # Senior level tags
            if responses.get('fm-s1') == 'allocate-roi-strategic':
                tags.append("Capital Allocator")
            if responses.get('fm-s2') == 'evaluate-comprehensive':
                tags.append("M&A Strategist")
            if responses.get('fm-s3') == 'drive-automation-governance':
                tags.append("Finance Transformer")
            if responses.get('fm-s4') == 'walk-through-transparent':
                tags.append("Board-Level Leader")
            if responses.get('fm-s5') == 'rebalance-strategic':
                tags.append("Risk Strategist")
            if responses.get('fm-s6') == 'develop-storytelling':
                tags.append("Team Builder")

    elif role == 'sales':
        experience = responses.get('experience', '')
        experience_level = _map_experience_to_level(experience)
        
        if experience_level == '0-3':
            # Entry level tags
            if responses.get('sm-e1') == 'audit-standardize':
                tags.append("Data-Driven")
            if responses.get('sm-e2') == 'reengage-objections':
                tags.append("Deal Execution Expert")
            if responses.get('sm-e3') == 'analyze-funnel':
                tags.append("Analytical Thinker")
            if responses.get('sm-e4') == 'explore-automation':
                tags.append("AI-Adopter")
            if responses.get('sm-e5') == 'investigate-value':
                tags.append("Strategic Thinker")
            if responses.get('sm-e6') == 'align-data':
                tags.append("Cross-Functional Leader")
        
        elif experience_level == '3-8':
            # Mid level tags
            if responses.get('sm-m1') == 'strengthen-forecasting':
                tags.append("Revenue Operations Expert")
            if responses.get('sm-m2') == 'map-stakeholders':
                tags.append("Enterprise Deal Expert")
            if responses.get('sm-m3') == 'define-icp':
                tags.append("Strategic Sales Leader")
            if responses.get('sm-m4') == 'use-ai-validate':
                tags.append("AI-Capable")
            if responses.get('sm-m5') == 'analyze-loss-reasons':
                tags.append("Data-Driven")
            if responses.get('sm-m6') == 'standardize-playbooks':
                tags.append("Team Builder")
        
        elif experience_level == '8+':
            # Senior level tags
            if responses.get('sm-s1') == 'reevaluate-strategy':
                tags.append("Revenue Strategist")
            if responses.get('sm-s2') == 'allocate-cac-ltv':
                tags.append("Portfolio Strategist")
            if responses.get('sm-s3') == 'diversify-revenue':
                tags.append("Risk Strategist")
            if responses.get('sm-s4') == 'define-use-cases':
                tags.append("AI Strategist")
            if responses.get('sm-s5') == 'walk-through-assumptions':
                tags.append("Executive Leader")
            if responses.get('sm-s6') == 'clear-segmentation':
                tags.append("Revenue Org Builder")

    elif role == 'marketing':
        experience = responses.get('experience', '')
        experience_level = _map_experience_to_level(experience)
        
        if experience_level == '0-3':
            # Entry level tags
            if responses.get('mm-e1') == 'analyze-funnel-metrics':
                tags.append("Data-Driven Marketer")
            if responses.get('mm-e2') == 'run-ab-tests':
                tags.append("Optimization-Focused")
            if responses.get('mm-e3') == 'define-persona-strategy':
                tags.append("Strategic Planner")
            if responses.get('mm-e4') == 'use-automation-ai':
                tags.append("AI-Adopter")
            if responses.get('mm-e5') == 'propose-balanced-mix':
                tags.append("Balanced Thinker")
            if responses.get('mm-e6') == 'analyze-mql-sql':
                tags.append("Analytical Leader")
        
        elif experience_level == '3-8':
            # Mid level tags
            if responses.get('mm-m1') == 'optimize-channel-mix':
                tags.append("Growth Strategist")
            if responses.get('mm-m2') == 'investigate-reconcile':
                tags.append("Analytics Expert")
            if responses.get('mm-m3') == 'conduct-market-research':
                tags.append("Strategic Marketer")
            if responses.get('mm-m4') == 'use-ai-validate-testing':
                tags.append("AI-Capable")
            if responses.get('mm-m5') == 'analyze-audience-targeting':
                tags.append("Data-Driven")
            if responses.get('mm-m6') == 'align-team-objectives':
                tags.append("Team Leader")
        
        elif experience_level == '8+':
            # Senior level tags
            if responses.get('mm-s1') == 'strengthen-brand-equity':
                tags.append("Brand Strategist")
            if responses.get('mm-s2') == 'allocate-cac-ltv-roi':
                tags.append("Portfolio Strategist")
            if responses.get('mm-s3') == 'redesign-attribution-framework':
                tags.append("Analytics Leader")
            if responses.get('mm-s4') == 'identify-pilot-scale':
                tags.append("AI Strategist")
            if responses.get('mm-s5') == 'localize-strategy':
                tags.append("Global Marketer")
            if responses.get('mm-s6') == 'define-specialization-kpis':
                tags.append("Org Builder")

    elif role == 'operations':
        experience = responses.get('experience', '')
        experience_level = _map_experience_to_level(experience)
        
        if experience_level == '0-3':
            # Entry level tags
            if responses.get('om-e1') == 'analyze-fulfillment-cycle':
                tags.append("Operations Excellence")
            if responses.get('om-e2') == 'investigate-root-cause':
                tags.append("Data Integrity Focused")
            if responses.get('om-e3') == 'explore-automation':
                tags.append("Process Automation")
            if responses.get('om-e4') == 'review-slas-discuss':
                tags.append("Supply Chain Strategist")
            if responses.get('om-e5') == 'pilot-ai-forecasting':
                tags.append("AI-Adopter")
            if responses.get('om-e6') == 'map-end-to-end':
                tags.append("Leadership Potential")
        
        elif experience_level == '3-8':
            # Mid level tags
            if responses.get('om-m1') == 'conduct-cost-driver-analysis':
                tags.append("Operations Excellence")
            if responses.get('om-m2') == 'activate-alternate-suppliers':
                tags.append("Supply Chain Strategist")
            if responses.get('om-m3') == 'redesign-workflows':
                tags.append("Strategic Thinker")
            if responses.get('om-m4') == 'evaluate-workflow-automation':
                tags.append("AI-Capable")
            if responses.get('om-m5') == 'standardize-kpi-definitions':
                tags.append("Data Governance Expert")
            if responses.get('om-m6') == 'implement-launch-checklists':
                tags.append("Cross-Functional Leader")
        
        elif experience_level == '8+':
            # Senior level tags
            if responses.get('om-s1') == 'redesign-operating-model':
                tags.append("Strategic Operations Leader")
            if responses.get('om-s2') == 'diversify-supplier-base':
                tags.append("Risk Strategist")
            if responses.get('om-s3') == 'define-phased-automation':
                tags.append("AI Strategist")
            if responses.get('om-s4') == 'present-root-cause-analysis':
                tags.append("Board-Level Leader")
            if responses.get('om-s5') == 'assess-regulatory-supplier':
                tags.append("Global Operations Strategist")
            if responses.get('om-s6') == 'establish-clear-ownership':
                tags.append("Org Builder")

    elif role == 'founder':
        experience = responses.get('experience', '')
        experience_level = _map_experience_to_level(experience)
        
        if experience_level == '0-3':
            # Entry level tags
            if responses.get('sf-e1') == 'validate-demand':
                tags.append("Validation-Focused")
            if responses.get('sf-e2') == 'reassess-value-prop':
                tags.append("Business Fundamentals")
            if responses.get('sf-e3') == 'focus-core-value':
                tags.append("Strategic Prioritizer")
            if responses.get('sf-e4') == 'prioritize-high-impact':
                tags.append("Resourceful Founder")
            if responses.get('sf-e5') == 'use-ai-validate':
                tags.append("AI-Adopter")
            if responses.get('sf-e6') == 'align-vision-validate':
                tags.append("Collaborative Leader")
        
        elif experience_level == '3-8':
            # Mid level tags
            if responses.get('sf-m1') == 'strengthen-distribution':
                tags.append("Scale Strategist")
            if responses.get('sf-m2') == 'optimize-channels-ltv':
                tags.append("Unit Economics Expert")
            if responses.get('sf-m3') == 'hire-culture-alignment':
                tags.append("Team Builder")
            if responses.get('sf-m4') == 'double-down-differentiation':
                tags.append("Competitive Strategist")
            if responses.get('sf-m5') == 'use-ai-efficiency':
                tags.append("AI-Capable")
            if responses.get('sf-m6') == 'present-data-backed-plan':
                tags.append("Data-Driven Leader")
        
        elif experience_level == '8+':
            # Senior level tags
            if responses.get('sf-s1') == 'allocate-strategic-fit':
                tags.append("Portfolio Strategist")
            if responses.get('sf-s2') == 'reevaluate-positioning':
                tags.append("Strategic Visionary")
            if responses.get('sf-s3') == 'define-org-structure':
                tags.append("Organizational Leader")
            if responses.get('sf-s4') == 'allocate-capital-roi':
                tags.append("Capital Allocator")
            if responses.get('sf-s5') == 'identify-pilot-scale':
                tags.append("AI Strategist")
            if responses.get('sf-s6') == 'define-values-principles':
                tags.append("Culture Builder")

    elif role == 'tech':
        experience = responses.get('experience', '')
        experience_level = _map_experience_to_level(experience)
        
        if experience_level == '0-3':
            # Entry level tags
            if responses.get('tm-e1') == 'review-data':
                tags.append("Data-Driven Engineer")
            if responses.get('tm-e2') == 'ux-cost':
                tags.append("Business-Minded")
            if responses.get('tm-e3') == 'inform-stakeholders':
                tags.append("Accountable")
            if responses.get('tm-e4') == 'business-impact':
                tags.append("Strategic Prioritizer")
            if responses.get('tm-e5') == 'productivity-cost':
                tags.append("AI-Adopter")
            if responses.get('tm-e6') == 'take-ownership':
                tags.append("Ownership Mindset")
        
        elif experience_level == '3-8':
            # Mid level tags
            if responses.get('tm-m1') == 'revenue-opportunity':
                tags.append("ROI-Focused")
            if responses.get('tm-m2') == 'analyze-drivers':
                tags.append("Cost-Conscious")
            if responses.get('tm-m3') == 'evaluate-align':
                tags.append("Cross-Functional Leader")
            if responses.get('tm-m4') == 'balance-debt':
                tags.append("Strategic Balancer")
            if responses.get('tm-m5') == 'pain-point-roi':
                tags.append("AI-Capable")
            if responses.get('tm-m6') == 'growth-priorities':
                tags.append("Strategic Allocator")
        
        elif experience_level == '8+':
            # Senior level tags
            if responses.get('tm-s1') == 'long-term-strategy':
                tags.append("Strategic Thinker")
            if responses.get('tm-s2') == 'allocate-roi':
                tags.append("Capital Allocator")
            if responses.get('tm-s3') == 'switching-cost-value':
                tags.append("Business Strategist")
            if responses.get('tm-s4') == 'modular-incremental':
                tags.append("Scalability Expert")
            if responses.get('tm-s5') == 'strategic-differentiation':
                tags.append("AI Strategist")
            if responses.get('tm-s6') == 'balanced-allocation':
                tags.append("Portfolio Strategist")

    # Add AI maturity tag if high
    if maturity == AIMaturityLevel.AI_NATIVE:
        tags.append("AI Native")
    elif maturity == AIMaturityLevel.AI_STRATEGIC:
        tags.append("AI Strategic")

    # Add role identifier only if we don't have enough specific tags
    if len(tags) < 2:
        role_identifiers = {
            'product-manager': 'Product Manager',
            'finance': 'Finance Professional',
            'sales': 'Sales Professional',
            'marketing': 'Marketer',
            'operations': 'Operations Professional',
            'founder': 'Founder',
            'tech': 'Tech Engineer'
        }
        if role in role_identifiers:
            tags.append(role_identifiers[role])

    return tags[:4]  # Max 4 tags

