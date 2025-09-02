import { getActiveConfig } from "@/config/aiConfig";
import { Concept, ConceptDifficulty } from "@/types/concepts";

export interface ConceptRequest {
  difficulty: ConceptDifficulty;
  category: string;
  count: number;
  specificTopic?: string;
  subject?: string;
}

export interface GeneratedConcept {
  title: string;
  definition: string;
  explanation: string;
  examples: string[];
  difficulty: ConceptDifficulty;
  category: string;
  tags: string[];
  relatedConcepts: string[];
  keyPoints: string[];
  commonMisconceptions: string[];
  traditionalChinese: string; // Traditional Chinese meaning
}

export class ConceptAIService {
  private static instance: ConceptAIService;
  private provider: any = null;
  private systemPrompts: Record<ConceptDifficulty, string>;

  private constructor() {
    this.initializeSystemPrompts();
    this.initializeDefaultConfig();
  }

  public static getInstance(): ConceptAIService {
    if (!ConceptAIService.instance) {
      ConceptAIService.instance = new ConceptAIService();
    }
    return ConceptAIService.instance;
  }

  private initializeSystemPrompts(): void {
    this.systemPrompts = {
      'Beginner': `You are an expert educator specializing in beginner-level concepts. 
      Your role is to generate clear, simple concepts that are perfect for someone just starting to learn.
      
      Guidelines for Beginner concepts:
      - Use simple, everyday analogies to explain complex ideas
      - Focus on fundamental concepts and basic principles
      - Provide very basic examples that are easy to understand
      - Avoid jargon and technical terms without explanation
      - Emphasize the "why" behind concepts
      - Keep explanations under 3 sentences
      - Use familiar examples from daily life
      
      Always generate concepts that build confidence and create a solid foundation for future learning.`,

      'Intermediate': `You are an expert educator specializing in intermediate-level concepts. 
      Your role is to generate concepts that build upon foundational knowledge and introduce more complex ideas.
      
      Guidelines for Intermediate concepts:
      - Assume basic knowledge of the subject area
      - Introduce more complex concepts gradually
      - Explain relationships and connections between ideas
      - Provide practical examples with moderate complexity
      - Include common applications and real-world uses
      - Focus on understanding rather than memorization
      - Use industry-standard terminology when appropriate
      
      Always generate concepts that challenge learners while remaining accessible.`,

      'Advanced': `You are an expert educator specializing in advanced-level concepts. 
      Your role is to generate sophisticated concepts for experienced learners.
      
      Guidelines for Advanced concepts:
      - Assume strong foundational knowledge
      - Cover complex relationships and advanced principles
      - Explain nuanced differences and subtle distinctions
      - Include advanced applications and specialized uses
      - Discuss theoretical frameworks and models
      - Cover interdisciplinary connections
      - Include critical analysis and evaluation
      
      Always generate concepts that push boundaries and expand expertise.`,

      'Professional': `You are an expert educator specializing in professional-level concepts. 
      Your role is to generate enterprise-grade concepts for professionals and experts.
      
      Guidelines for Professional concepts:
      - Assume expert-level knowledge in the field
      - Cover cutting-edge developments and innovations
      - Explain advanced methodologies and best practices
      - Include industry standards and professional guidelines
      - Discuss strategic implications and business value
      - Cover risk management and quality assurance
      - Include ethical considerations and professional responsibility
      
      Always generate concepts that represent industry best practices and cutting-edge knowledge.`
    };
  }

  private initializeDefaultConfig(): void {
    try {
      const config = getActiveConfig();
      if (config) {
        this.provider = config;
      }
    } catch (error) {
      console.error('Failed to initialize AI config:', error);
    }
  }

  public getSystemPrompt(difficulty: ConceptDifficulty): string {
    return this.systemPrompts[difficulty];
  }

  public setSystemPrompt(difficulty: ConceptDifficulty, prompt: string): void {
    this.systemPrompts[difficulty] = prompt;
  }

  public async generateConcepts(request: ConceptRequest): Promise<GeneratedConcept[]> {
    const systemPrompt = this.getSystemPrompt(request.difficulty);
    
    const userPrompt = this.buildConceptPrompt(request);
    
    try {
      const response = await this.makeAPIRequest(systemPrompt, userPrompt);
      return this.parseConceptResponse(response);
    } catch (error) {
      console.error('Error generating concepts:', error);
      throw error;
    }
  }

  private buildConceptPrompt(request: ConceptRequest): string {
    const { difficulty, category, count, specificTopic, subject } = request;
    
    let prompt = `Generate ${count} concepts for the ${category} category at ${difficulty} level.`;
    
    if (subject) {
      prompt += ` Subject area: ${subject}`;
    }
    
    if (specificTopic) {
      prompt += ` Focus specifically on: ${specificTopic}`;
    }
    
    prompt += `

    For each concept, provide:
    1. A clear, concise title
    2. A simple definition that a ${difficulty.toLowerCase()} learner can understand
    3. A detailed explanation with practical examples
    4. 2-3 relevant examples that illustrate the concept
    5. Appropriate tags for categorization
    6. Related concepts that build upon this one
    7. Key points to remember
    8. Common misconceptions to avoid
    9. Traditional Chinese translation of the concept title and definition

    Format the response as a JSON array with the following structure:
    [
      {
        "title": "Concept Name",
        "definition": "Simple definition",
        "explanation": "Detailed explanation",
        "examples": ["example1", "example2", "example3"],
        "difficulty": "${difficulty}",
        "category": "${category}",
        "tags": ["tag1", "tag2"],
        "relatedConcepts": ["related1", "related2"],
        "keyPoints": ["point1", "point2"],
        "commonMisconceptions": ["misconception1", "misconception2"],
        "traditionalChinese": "繁體中文翻譯"
      }
    ]`;

    return prompt;
  }

  private async makeAPIRequest(systemPrompt: string, userPrompt: string): Promise<string> {
    if (!this.provider) {
      throw new Error('AI provider not configured');
    }

    const requestBody = {
      model: this.provider.model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    };

    try {
      console.log('🚀 Making API request to:', this.provider.baseUrl + (this.provider.endpoint || '/v1/chat/completions'));
      console.log('📤 Request body:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(this.provider.baseUrl + (this.provider.endpoint || '/v1/chat/completions'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.provider.apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('📥 Raw API response:', JSON.stringify(data, null, 2));
      
      const content = data.choices[0]?.message?.content || '';
      console.log('📝 Extracted content:', content);
      
      return content;
    } catch (error) {
      console.error('❌ API request error:', error);
      throw error;
    }
  }

  private parseConceptResponse(response: string): GeneratedConcept[] {
    try {
      console.log('🔍 Parsing AI response...');
      console.log('📄 Raw response text:', response);
      
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        console.error('❌ No JSON array found in response');
        throw new Error('No JSON array found in response');
      }

      console.log('✅ Found JSON array:', jsonMatch[0]);
      
      const concepts = JSON.parse(jsonMatch[0]);
      console.log('📊 Parsed concepts array:', concepts);
      
      const formattedConcepts = concepts.map((concept: any, index: number) => {
        console.log(`📝 Processing concept ${index + 1}:`, concept);
        
        const formatted = {
          title: concept.title,
          definition: concept.definition,
          explanation: concept.explanation,
          examples: Array.isArray(concept.examples) ? concept.examples : [],
          difficulty: concept.difficulty,
          category: concept.category,
          tags: Array.isArray(concept.tags) ? concept.tags : [],
          relatedConcepts: Array.isArray(concept.relatedConcepts) ? concept.relatedConcepts : [],
          keyPoints: Array.isArray(concept.keyPoints) ? concept.keyPoints : [],
          commonMisconceptions: Array.isArray(concept.commonMisconceptions) ? concept.commonMisconceptions : [],
          traditionalChinese: concept.traditionalChinese
        };
        
        console.log(`✅ Formatted concept ${index + 1}:`, formatted);
        return formatted;
      });
      
      console.log('🎉 Final formatted concepts:', formattedConcepts);
      return formattedConcepts;
      
    } catch (error) {
      console.error('❌ Error parsing concept response:', error);
      throw new Error('Failed to parse AI response');
    }
  }
}
//Call API and choose the answer depends on the level of the user.