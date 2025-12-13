// @ts-ignore
import { Link } from "react-router-dom";
import {
  Droplets,
  AlertTriangle,
  Fish,
  Heart,
  Globe,
  ArrowRight,
  Waves,
  Factory,
  Trash2,
  ShieldAlert,
  TreePine,
  Users,
  ChevronRight,
  ExternalLink,
  Map,
} from "lucide-react";

function InfoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* 헤더 */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-blue-500/20 sticky top-0 z-[1000]">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-xl">
                <Droplets className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  미세플라스틱 해양유출 위험지도
                </h1>
                <p className="text-sm text-blue-300/70">
                  왜 미세플라스틱이 위험한가요?
                </p>
              </div>
            </div>
            <nav className="flex items-center gap-2">
              <Link
                to="/info"
                className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30"
              >
                안내
              </Link>
              <Link
                to="/map"
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:bg-slate-800 transition-colors flex items-center gap-2"
              >
                <Map className="w-4 h-4" />
                위험지도
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 rounded-full border border-red-500/30 mb-6">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-red-300 text-sm font-medium">
              환경 위기 경고
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            보이지 않는 위협,
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              미세플라스틱
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            매년 800만 톤의 플라스틱이 바다로 흘러들어갑니다.
            <br />
            그 중 상당량이 5mm 이하의 미세플라스틱으로 분해되어
            <br />
            우리의 식탁까지 돌아옵니다.
          </p>
          <Link
            to="/map"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
          >
            우리 지역 위험도 확인하기
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* 미세플라스틱이란? */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">
              미세플라스틱이란?
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              크기가 5mm 이하인 작은 플라스틱 조각으로, 육안으로 보기 어려울
              정도로 작습니다.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-orange-500/20 rounded-xl">
                  <Factory className="w-6 h-6 text-orange-400" />
                </div>
                <h4 className="text-xl font-bold text-white">
                  1차 미세플라스틱
                </h4>
              </div>
              <p className="text-gray-300 mb-4">
                처음부터 작은 크기로 제조된 플라스틱입니다.
              </p>
              <ul className="space-y-2">
                {[
                  "세안제/치약의 마이크로비즈",
                  "화장품의 글리터",
                  "세탁 시 빠지는 합성섬유",
                  "산업용 연마제",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-400">
                    <ChevronRight className="w-4 h-4 text-orange-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Trash2 className="w-6 h-6 text-purple-400" />
                </div>
                <h4 className="text-xl font-bold text-white">
                  2차 미세플라스틱
                </h4>
              </div>
              <p className="text-gray-300 mb-4">
                큰 플라스틱이 분해되어 만들어진 조각입니다.
              </p>
              <ul className="space-y-2">
                {[
                  "페트병, 비닐봉지 분해",
                  "타이어 마모 입자",
                  "도로 노면 표시 페인트",
                  "어업용 그물/로프 마모",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-400">
                    <ChevronRight className="w-4 h-4 text-purple-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 하천을 통한 해양 유입 경로 */}
      <section className="py-16 px-4 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">
              어떻게 바다로 흘러가나요?
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              도시에서 발생한 미세플라스틱은 비가 올 때 하천을 통해 바다로
              유입됩니다.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {[
              {
                icon: Factory,
                title: "도시 발생",
                desc: "도로, 공장, 가정에서 미세플라스틱 발생",
                color: "orange",
              },
              {
                icon: Droplets,
                title: "강우 유출",
                desc: "빗물이 미세플라스틱을 하수구로 운반",
                color: "blue",
              },
              {
                icon: Waves,
                title: "하천 이동",
                desc: "하천을 따라 바다 방향으로 이동",
                color: "cyan",
              },
              {
                icon: Globe,
                title: "해양 유입",
                desc: "결국 바다로 흘러들어 축적",
                color: "red",
              },
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="bg-slate-800/50 backdrop-blur rounded-xl p-5 border border-slate-700/50 h-full">
                  <div
                    className={`p-3 bg-${step.color}-500/20 rounded-xl w-fit mb-4`}
                  >
                    <step.icon className={`w-6 h-6 text-${step.color}-400`} />
                  </div>
                  <div className="text-xs text-gray-500 mb-1">STEP {i + 1}</div>
                  <h4 className="text-lg font-bold text-white mb-2">
                    {step.title}
                  </h4>
                  <p className="text-sm text-gray-400">{step.desc}</p>
                </div>
                {i < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-4 h-4 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-blue-500/10 rounded-2xl border border-blue-500/20">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <ShieldAlert className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">
                  왜 비가 올 때 더 위험한가요?
                </h4>
                <p className="text-gray-300">
                  평소에는 도로나 토양에 쌓여있던 미세플라스틱이{" "}
                  <strong className="text-blue-300">
                    강우 시 빗물과 함께 쓸려
                  </strong>{" "}
                  하수구와 하천으로 대량 유입됩니다. 특히{" "}
                  <strong className="text-blue-300">
                    도시화된 지역, 산업단지 인근, 하천 주변
                  </strong>
                  에서 유출량이 급격히 증가합니다. 이것이 바로 우리 서비스가
                  '침수위험도'와 '도시화 정도'를 위험도 계산에 포함하는
                  이유입니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 해양 생태계 영향 */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">
              해양 생태계에 미치는 영향
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              바다로 유입된 미세플라스틱은 해양 생물과 전체 생태계에 심각한
              위협이 됩니다.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-red-500/10 to-transparent rounded-2xl p-6 border border-red-500/20">
              <Fish className="w-10 h-10 text-red-400 mb-4" />
              <h4 className="text-xl font-bold text-white mb-3">
                해양 생물 섭취
              </h4>
              <p className="text-gray-300 mb-4">
                플랑크톤부터 고래까지, 거의 모든 해양 생물이 먹이로 오인하여
                미세플라스틱을 섭취합니다.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• 물고기의 73%에서 미세플라스틱 검출</li>
                <li>• 조개류 1kg당 평균 90개 입자 포함</li>
                <li>• 해양 포유류 소화기관 손상</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-yellow-500/10 to-transparent rounded-2xl p-6 border border-yellow-500/20">
              <AlertTriangle className="w-10 h-10 text-yellow-400 mb-4" />
              <h4 className="text-xl font-bold text-white mb-3">
                유해물질 농축
              </h4>
              <p className="text-gray-300 mb-4">
                미세플라스틱은 바다의 유해 화학물질을 흡착하여 농축시키는 '독성
                스펀지' 역할을 합니다.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• PCB, DDT 등 잔류성 유기오염물질 흡착</li>
                <li>• 중금속 농축 효과</li>
                <li>• 먹이사슬 통해 생물 농축</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-transparent rounded-2xl p-6 border border-purple-500/20">
              <TreePine className="w-10 h-10 text-purple-400 mb-4" />
              <h4 className="text-xl font-bold text-white mb-3">생태계 교란</h4>
              <p className="text-gray-300 mb-4">
                해양 생태계 전반에 걸쳐 먹이사슬 교란과 서식지 파괴가
                발생합니다.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• 산호초 백화 현상 가속</li>
                <li>• 해저 생태계 산소 부족</li>
                <li>• 어류 번식력 저하</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 인체 건강 영향 */}
      <section className="py-16 px-4 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">
              우리 건강에 미치는 영향
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              해양으로 유입된 미세플라스틱은 결국 우리 식탁으로 돌아옵니다.
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-8 border border-slate-700/50">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-red-500/20 rounded-xl">
                    <Heart className="w-6 h-6 text-red-400" />
                  </div>
                  <h4 className="text-xl font-bold text-white">
                    인체 노출 경로
                  </h4>
                </div>
                <ul className="space-y-4">
                  {[
                    {
                      title: "해산물 섭취",
                      desc: "오염된 어패류를 통한 직접 섭취",
                    },
                    {
                      title: "식수 오염",
                      desc: "수돗물, 생수에서도 미세플라스틱 검출",
                    },
                    {
                      title: "공기 흡입",
                      desc: "대기 중 부유하는 미세플라스틱 흡입",
                    },
                    {
                      title: "피부 접촉",
                      desc: "화장품, 세정제를 통한 피부 노출",
                    },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs text-red-400 font-bold">
                          {i + 1}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{item.title}</p>
                        <p className="text-sm text-gray-400">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-yellow-500/20 rounded-xl">
                    <Users className="w-6 h-6 text-yellow-400" />
                  </div>
                  <h4 className="text-xl font-bold text-white">건강 위험</h4>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-700/30 rounded-xl">
                    <p className="text-white font-medium mb-1">연간 섭취량</p>
                    <p className="text-3xl font-bold text-yellow-400">약 5g</p>
                    <p className="text-sm text-gray-400">
                      신용카드 1장 분량의 플라스틱을 매주 섭취
                    </p>
                  </div>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                      내분비계 교란 (환경호르몬)
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                      염증 반응 및 면역 체계 영향
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                      장기적 축적에 따른 잠재적 위험
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            우리 지역은 얼마나 위험할까요?
          </h3>
          <p className="text-gray-400 mb-8">
            경기도 31개 시군구의 미세플라스틱 해양 유출 위험도를 확인하고,
            <br />
            우리 지역의 환경 보호에 관심을 가져주세요.
          </p>
          <Link
            to="/map"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-medium text-lg transition-all shadow-lg shadow-blue-500/25"
          >
            <Map className="w-5 h-5" />
            위험지도 보러가기
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="py-8 px-4 border-t border-slate-800">
        <div className="max-w-6xl mx-auto text-center text-sm text-gray-500">
          <p className="mb-2">
            경기도 기후데이터 기반 미세플라스틱 해양유출 위험지도
          </p>
          <p>데이터 출처: 경기기후플랫폼 API (climate.gg.go.kr)</p>
        </div>
      </footer>
    </div>
  );
}

export default InfoPage;
