<<<<<<< HEAD
# English-learning-app
=======
# AI-Powered English Learning App

A personalized English vocabulary learning application powered by DeepSeek R1 1.5B AI model through Ollama.

## Features

- 🤖 **AI-Powered Content**: Dynamic vocabulary generation using DeepSeek R1 1.5B model
- 📚 **Personalized Learning**: 7-day study plans tailored to your profession and interests
- 🎯 **Progressive Difficulty**: 70 carefully selected words with increasing complexity
- 🎮 **Interactive Exercises**: Fill-in-blank, multiple choice, and matching exercises
- 📱 **Modern UI**: Beautiful, responsive interface built with shadcn/ui
- 🔄 **Fallback System**: Graceful degradation to pre-built content when AI is unavailable

## Quick Start

### Prerequisites

- Node.js & npm
- Ollama (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd englishAPP
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Ollama (Optional but Recommended)**
   
   Follow the detailed setup guide in [OLLAMA_SETUP.md](./OLLAMA_SETUP.md) to:
   - Install Ollama
   - Download the DeepSeek R1 1.5B model
   - Verify the setup

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173` and start learning!

## How It Works

### AI Integration

The app uses the DeepSeek R1 1.5B model through Ollama to:

- **Generate personalized vocabulary** based on your occupation and interests
- **Create contextual examples** that relate to your professional field
- **Design interactive exercises** tailored to the generated content
- **Provide progressive difficulty** that adapts to your learning level

### Fallback System

If Ollama is not available or the AI model fails:
- The app automatically falls back to pre-built vocabulary databases
- All functionality remains intact
- Users can still access high-quality learning content

### Learning Flow

1. **Input Your Details**: Tell us about your work and interests
2. **AI Analysis**: The system generates a personalized 7-day plan
3. **Daily Sessions**: Complete interactive lessons with flashcards and exercises
4. **Progress Tracking**: Monitor your learning journey and mastery levels

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: shadcn/ui + Tailwind CSS
- **AI Integration**: Ollama + DeepSeek R1 1.5B
- **State Management**: React Query + React Hooks
- **Routing**: React Router DOM

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── WeeklyPlanGenerator.tsx
│   ├── DailySession.tsx
│   └── ...
├── utils/
│   ├── ollamaService.ts    # AI integration service
│   └── vocabularyGenerator.ts
├── types/
│   └── learning.ts         # TypeScript definitions
└── pages/
    └── Index.tsx           # Main application page
```

## Configuration

### AI Model Settings

You can customize the AI model in `src/utils/ollamaService.ts`:

```typescript
private modelName = 'deepseek-r1:1.5b'; // Change to your preferred model
```

### Alternative Models

If you prefer different models, you can use:
- `llama2:7b` - Smaller, faster
- `llama2:13b` - More capable but larger
- `mistral:7b` - Good balance of speed and quality

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Features

1. **New Exercise Types**: Add to `InteractiveExercise` type in `types/learning.ts`
2. **AI Prompts**: Modify prompts in `utils/ollamaService.ts`
3. **UI Components**: Use shadcn/ui components in `components/ui/`

## Troubleshooting

### Common Issues

1. **Ollama not running**
   - Check if Ollama service is started
   - Verify it's running on `http://localhost:11434`

2. **Model not found**
   - Run `ollama pull deepseek-r1:1.5b`
   - Check available models with `ollama list`

3. **Out of memory**
   - Close other applications
   - Consider using a smaller model

### Getting Help

- Check [OLLAMA_SETUP.md](./OLLAMA_SETUP.md) for detailed setup instructions
- Visit [Ollama documentation](https://ollama.ai/docs)
- Join the [Ollama Discord community](https://discord.gg/ollama)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For support and questions:
- Check the troubleshooting section above
- Review the Ollama setup guide
- Open an issue on GitHub

---

**Happy Learning! 🎓✨**
>>>>>>> 44268d0 (First-version)
