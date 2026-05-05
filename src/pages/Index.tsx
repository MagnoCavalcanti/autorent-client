import { useState } from 'react';
import { useNavigate } from 'react-router';

const Index: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <h1 className="text-3xl font-black bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Autorent
              </h1>
            </div>
            
            <div className="hidden md:flex gap-8 items-center">
              <a href="#home" className="text-slate-600 hover:text-blue-600 font-medium transition">Home</a>
              <a href="#features" className="text-slate-600 hover:text-blue-600 font-medium transition">Recursos</a>
              <a href="#benefits" className="text-slate-600 hover:text-blue-600 font-medium transition">Benefícios</a>
              <a href="#pricing" className="text-slate-600 hover:text-blue-600 font-medium transition">Preços</a>
              <a href="#contact" className="text-slate-600 hover:text-blue-600 font-medium transition">Contato</a>
              <button
                onClick={() => navigate('/login')}
                className="px-5 py-2 text-blue-600 font-semibold border border-blue-200 rounded-lg hover:bg-blue-50 transition"
              >
                Entrar
              </button>
              <button
                onClick={() => navigate('/cadastro')}
                className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
              >
                Cadastrar
              </button>
            </div>

            <button 
              className="md:hidden p-2"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {menuOpen && (
            <div className="md:hidden pb-4 flex flex-col gap-3">
              <a href="#home" className="text-slate-600 hover:text-blue-600 font-medium">Home</a>
              <a href="#features" className="text-slate-600 hover:text-blue-600 font-medium">Recursos</a>
              <a href="#benefits" className="text-slate-600 hover:text-blue-600 font-medium">Benefícios</a>
              <a href="#pricing" className="text-slate-600 hover:text-blue-600 font-medium">Preços</a>
              <a href="#contact" className="text-slate-600 hover:text-blue-600 font-medium">Contato</a>
              <button onClick={() => navigate('/login')} className="text-left text-blue-600 font-semibold">Entrar</button>
              <button onClick={() => navigate('/cadastro')} className="text-left text-blue-600 font-semibold">Cadastrar</button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-[90vh] flex items-center justify-center px-4 py-20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-6 inline-block">
            <span className="px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">� Software de Gestão</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 leading-tight">
            Gerencie Sua Empresa de <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Aluguel de Carros</span>
          </h1>

          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            Autorent é o sistema de gestão completo para empresas de aluguel. Controle reservas, frotas, clientes, documentação e financeiro de forma integrada e eficiente.
          </p>

          <div className="flex gap-4 justify-center flex-wrap mb-16">
            <button
              onClick={() => navigate('/cadastro')}
              className="px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg hover:shadow-xl hover:scale-105 transition transform"
            >
              Começar Grátis
            </button>
            <button className="px-10 py-4 border-2 border-slate-300 text-slate-900 font-semibold rounded-lg hover:border-blue-600 hover:text-blue-600 transition">
              Agendar Demo
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-2xl font-black text-blue-600">1000+</p>
              <p className="text-xs text-slate-600 mt-1">Empresas</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-2xl font-black text-blue-600">100k+</p>
              <p className="text-xs text-slate-600 mt-1">Reservas/Mês</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-2xl font-black text-blue-600">99.9%</p>
              <p className="text-xs text-slate-600 mt-1">Uptime</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-2xl font-black text-blue-600">24/7</p>
              <p className="text-xs text-slate-600 mt-1">Suporte</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">RECURSOS PRINCIPAIS</span>
            <h2 className="text-5xl font-black text-slate-900 mt-6 mb-4">Gestão Completa em um Só Lugar</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">Todas as ferramentas que sua empresa de aluguel precisa para crescer</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: "📅", title: "Gestão de Reservas", desc: "Sistema inteligente de reservas com calendário compartilhado e confirmação automática" },
              { icon: "🚗", title: "Controle de Frota", desc: "Gerencie todos os veículos, status de manutenção, documentação e histórico de uso" },
              { icon: "👥", title: "Base de Clientes", desc: "Cadastro completo de clientes com histórico, documentos e contatos" },
              { icon: "📊", title: "Relatórios & Analytics", desc: "Dashboards em tempo real com KPIs de ocupação, receita e rentabilidade" },
              { icon: "💰", title: "Gestão Financeira", desc: "Controle de pagamentos, faturas, comissões e fluxo de caixa" },
              { icon: "📱", title: "Acesso Mobile", desc: "Aplicativo iOS e Android para gerenciar operações em qualquer lugar" }
            ].map((feature, i) => (
              <div 
                key={i}
                className="p-8 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition group"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition transform">{feature.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">POR QUE ESCOLHER AUTORENT?</span>
            <h2 className="text-5xl font-black text-slate-900 mt-6 mb-4">Otimize Sua Operação</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              {[
                { title: "Automatize Processos", desc: "Reduza trabalho manual com automação de reservas, confirmações e relatórios" },
                { title: "Evite Conflitos", desc: "Não perca reservas por double-booking ou informações desatualizadas" },
                { title: "Dados Centralizados", desc: "Todas as informações em um único sistema, sem planilhas espalhadas" },
                { title: "Visibilidade Total", desc: "Relatórios em tempo real para tomar decisões melhores e mais rápidas" },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold">✓</div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-slate-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl h-96"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 rounded-2xl p-8">
              <p className="text-4xl font-black text-blue-600 mb-2">70%</p>
              <p className="text-slate-600">Redução de tempo administrativo</p>
            </div>
            <div className="bg-blue-50 rounded-2xl p-8">
              <p className="text-4xl font-black text-blue-600 mb-2">40%</p>
              <p className="text-slate-600">Aumento na ocupação média</p>
            </div>
            <div className="bg-blue-50 rounded-2xl p-8">
              <p className="text-4xl font-black text-blue-600 mb-2">90%</p>
              <p className="text-slate-600">Satisfação de clientes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">PLANOS SIMPLES</span>
            <h2 className="text-5xl font-black text-slate-900 mt-6 mb-4">Escolha o Plano Ideal</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">Sem contratos longos, cancele quando quiser</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Básico",
                price: "R$ 199",
                desc: "Para pequenas operações",
                features: ["Até 30 veículos", "Gestão de reservas", "Base de clientes", "Dashboard básico", "1 usuário", "Email support"],
                highlighted: false,
              },
              {
                name: "Profissional",
                price: "R$ 599",
                desc: "Para empresas em crescimento",
                features: ["Até 300 veículos", "Tudo do Básico +", "Relatórios avançados", "5 usuários", "API acesso", "Prioridade suporte"],
                highlighted: true,
              },
              {
                name: "Enterprise",
                price: "Customizado",
                desc: "Solução personalizada",
                features: ["Ilimitado", "Suporte 24/7", "Implementação dedicada", "Integrações custom", "SLA 99.9%", "Account manager"],
                highlighted: false,
              }
            ].map((plan, i) => (
              <div 
                key={i}
                className={`rounded-2xl p-10 transition transform hover:scale-105 ${
                  plan.highlighted 
                    ? 'bg-gradient-to-b from-blue-600 to-blue-500 text-white border-2 border-blue-400 shadow-xl' 
                    : 'bg-white border border-slate-200'
                }`}
              >
                <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-slate-900'}`}>{plan.name}</h3>
                <p className={plan.highlighted ? 'text-blue-100 mb-4' : 'text-slate-600 mb-4'}>{plan.desc}</p>
                <p className="text-4xl font-black mb-8">{plan.price}<span className="text-lg font-normal">/mês</span></p>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3">
                      <span className="font-bold">✓</span>
                      <span className={plan.highlighted ? 'text-blue-50' : 'text-slate-600'}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate(plan.name === 'Enterprise' ? '#contact' : '/cadastro')}
                  className={`w-full py-3 font-semibold rounded-lg transition ${
                    plan.highlighted
                      ? 'bg-white text-blue-600 hover:bg-blue-50'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {plan.name === 'Enterprise' ? 'Contato' : 'Começar'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-500">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-black mb-6">Comece a Gerenciar Melhor Hoje</h2>
          <p className="text-lg mb-10 opacity-90">14 dias de teste grátis. Sem cartão de crédito necessário.</p>
          <button
            onClick={() => navigate('/cadastro')}
            className="px-10 py-4 bg-white text-blue-600 font-bold rounded-lg hover:shadow-xl hover:scale-105 transition transform"
          >
            Começar Teste Grátis
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-slate-900 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent mb-4">Autorent</h3>
              <p className="text-slate-400">Sistema de gestão para empresas de aluguel de carros</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Produto</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#features" className="hover:text-blue-400 transition">Recursos</a></li>
                <li><a href="#pricing" className="hover:text-blue-400 transition">Preços</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Docs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Empresa</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-blue-400 transition">Sobre</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Blog</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Suporte</h4>
              <p className="text-slate-400 mb-2">📞 (11) 1234-5678</p>
              <p className="text-slate-400">📧 suporte@autorent.com</p>
            </div>
          </div>
          
          <div className="border-t border-slate-700 pt-8 text-center text-slate-400">
            <p>&copy; 2026 Autorent. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;