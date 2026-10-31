import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Brain,
  Zap,
  History,
  ArrowRight,
  FileText,
  Cpu,
  BarChart3,
  CheckCircle2,
  Layers,
  AlertTriangle,
  Code2,
  FlaskConical,
  Sparkles,
  ScanText,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';

const features = [
  {
    icon: Search,
    title: 'Text Analysis',
    desc: 'Paste any news headline or article and the system processes the text using natural language processing techniques.',
  },
  {
    icon: Brain,
    title: 'ML Classification',
    desc: 'A trained machine learning classifier evaluates the text features and predicts whether it is likely real or fake.',
  },
  {
    icon: Zap,
    title: 'Fast Predictions',
    desc: 'The TF-IDF pipeline and trained model produce predictions quickly, making it practical for quick checks.',
  },
  {
    icon: History,
    title: 'Detection History',
    desc: 'Every analysis is saved to your account so you can review, search, and revisit past predictions at any time.',
  },
];

const steps = [
  { icon: FileText, title: 'Enter News Text', desc: 'Paste a headline or article body into the detection input.' },
  { icon: ScanText, title: 'Preprocess Text', desc: 'The text is cleaned, tokenized, and normalized for analysis.' },
  { icon: BarChart3, title: 'Extract TF-IDF Features', desc: 'Term frequency-inverse document frequency features are computed.' },
  { icon: Cpu, title: 'Apply ML Classifier', desc: 'The trained model evaluates the features and produces a prediction.' },
  { icon: CheckCircle2, title: 'Display Prediction', desc: 'The result is shown as REAL or FAKE with the model confidence.' },
];

const techStack = [
  { name: 'Python', icon: Code2 },
  { name: 'Flask', icon: FlaskConical },
  { name: 'NLP', icon: ScanText },
  { name: 'TF-IDF', icon: BarChart3 },
  { name: 'Scikit-learn', icon: Layers },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-navy-900 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-1.5 mb-6 animate-fade-in">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Analyze news with Machine Learning</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-navy-900 leading-tight mb-6 animate-slide-up">
              Detect Potential Fake News<br />
              <span className="text-blue-600">with Machine Learning</span>
            </h1>
            <p className="text-lg text-navy-500 mb-8 max-w-2xl mx-auto leading-relaxed">
              TruthLens uses NLP and a TF-IDF-based machine learning classifier to analyze news text
              and predict whether it is likely real or fake. Enter any article, get an instant assessment.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center animate-slide-up">
              <Button variant="secondary" size="lg" onClick={() => navigate('/register')}>
                Start Detection <ArrowRight className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/register')}>
                Create Free Account
              </Button>
            </div>
            <p className="mt-6 text-xs text-gray-400 italic max-w-lg mx-auto">
              Predictions are based on learned text patterns and do not guarantee factual verification.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-navy-900 mb-3">Features</h2>
            <p className="text-navy-500 max-w-xl mx-auto">
              Everything you need to analyze news articles and track your detection history.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="card-base p-6 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="flex items-center justify-center rounded-lg h-12 w-12 bg-blue-50 mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-navy-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-navy-500 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50 scroll-mt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-navy-900 mb-3">How It Works</h2>
            <p className="text-navy-500 max-w-xl mx-auto">
              From raw text to prediction, here is the pipeline behind TruthLens.
            </p>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-blue-200 hidden sm:block" />
            <div className="space-y-6">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="flex gap-4 sm:gap-6 relative animate-slide-up">
                    <div className="flex-shrink-0 relative z-10">
                      <div className="flex items-center justify-center rounded-xl h-12 w-12 bg-white border-2 border-blue-200 shadow-card">
                        <Icon className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1 card-base p-5">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">
                          Step {index + 1}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-navy-900 mb-1">{step.title}</h3>
                      <p className="text-sm text-navy-500">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-navy-900 mb-3">Technology Stack</h2>
            <p className="text-navy-500">The tools and frameworks powering TruthLens</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {techStack.map((tech) => {
              const Icon = tech.icon;
              return (
                <div
                  key={tech.name}
                  className="flex flex-col items-center gap-3 card-base p-6 hover:shadow-card-hover transition-shadow"
                >
                  <Icon className="h-8 w-8 text-navy-600" />
                  <span className="text-sm font-medium text-navy-700">{tech.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Limitations */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-base p-8 border-l-4 border-l-warning-400">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center rounded-lg h-10 w-10 bg-warning-100 flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-warning-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-navy-900 mb-2">Project Limitations</h2>
                <p className="text-sm text-navy-600 leading-relaxed">
                  TruthLens is a college PBL project designed for educational purposes. The predictions
                  are generated by a machine learning model trained on labeled datasets and are based
                  on statistical text patterns. They are <strong>not definitive fact-checks</strong> and
                  should not be used as the sole basis for determining the truthfulness of any news article.
                  Always verify important claims using reliable, independent sources.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-navy-800 to-navy-950">
        <div className="max-w-3xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to analyze news?</h2>
          <p className="text-navy-100/70 mb-8 max-w-lg mx-auto">
            Create a free account and start detecting potential fake news with machine learning.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="secondary" size="lg" onClick={() => navigate('/register')}>
              Get Started <ArrowRight className="h-5 w-5" />
            </Button>
            <Link to="/login">
              <Button variant="outline" size="lg" className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:border-white/50 hover:text-white">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
