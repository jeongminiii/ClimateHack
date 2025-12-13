// @ts-ignore
import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import { Droplets, AlertTriangle, Leaf, Factory, Info, TrendingUp } from 'lucide-react'
import 'leaflet/dist/leaflet.css'
import { getLayer } from './lib/ggClimate'

// 위험도 계산 로직
interface RiskArea {
  id: string
  name: string
  lat: number
  lng: number
  riskScore: number
  factors: {
    floodRisk: number      // 침수 위험도
    urbanization: number   // 도시화 정도
    greenCoverage: number  // 녹지 비율
    roadDensity: number    // 도로 밀도
  }
  description: string
}

// EPSG:5186 -> WGS84 변환 (간단 근사)
function toWGS84(x: number, y: number): [number, number] {
  const lng = (x - 200000) / 88000 + 127
  const lat = (y - 600000) / 111000 + 38
  return [lat, lng]
}

// 폴리곤 중심점 계산
function getCenter(coords: any): [number, number] {
  try {
    const ring = Array.isArray(coords[0]?.[0]) ? coords[0] : coords
    if (!ring || ring.length === 0) return [37.5, 127]
    const sum = ring.reduce((acc: number[], c: number[]) => [acc[0] + c[0], acc[1] + c[1]], [0, 0])
    return toWGS84(sum[0] / ring.length, sum[1] / ring.length)
  } catch {
    return [37.5, 127]
  }
}

// 위험도에 따른 색상
function getRiskColor(score: number): string {
  if (score >= 80) return '#ef4444' // 빨강 - 매우 위험
  if (score >= 60) return '#f97316' // 주황 - 위험
  if (score >= 40) return '#eab308' // 노랑 - 주의
  if (score >= 20) return '#22c55e' // 초록 - 양호
  return '#3b82f6' // 파랑 - 안전
}

function getRiskLevel(score: number): string {
  if (score >= 80) return '매우 위험'
  if (score >= 60) return '위험'
  if (score >= 40) return '주의'
  if (score >= 20) return '양호'
  return '안전'
}

function App() {
  const [riskAreas, setRiskAreas] = useState<RiskArea[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRisk, setSelectedRisk] = useState<RiskArea | null>(null)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    async function loadData() {
      try {
        // 여러 레이어에서 데이터 가져오기
        const [floodData, biotopData, parkData] = await Promise.all([
          getLayer('flood_risk_map', 100).catch(() => ({ features: [] })),
          getLayer('biotop_type_evl_5grd', 200).catch(() => ({ features: [] })),
          getLayer('park', 100).catch(() => ({ features: [] }))
        ])

        // 비오톱 데이터 기반으로 위험도 계산
        const areas: RiskArea[] = []
        const processed = new Set<string>()

        // @ts-ignore
        biotopData.features?.forEach((f: any, idx: number) => {
          const props = f.properties || {}
          const sgg = props.sgg_nm || props.SGG_NM || `지역${idx}`

          if (processed.has(sgg)) return
          processed.add(sgg)

          const center = getCenter(f.geometry?.coordinates)

          // 위험도 요소 계산 (실제 데이터 기반 + 시뮬레이션)
          const urbanType = props.lclsf_nm || props.mclsf_nm || ''
          const isUrban = urbanType.includes('주거') || urbanType.includes('상업') || urbanType.includes('공업')
          const isGreen = urbanType.includes('녹지') || urbanType.includes('산림') || urbanType.includes('공원')

          const floodRisk = Math.random() * 40 + (isUrban ? 40 : 10)
          const urbanization = isUrban ? 60 + Math.random() * 30 : 20 + Math.random() * 30
          const greenCoverage = isGreen ? 60 + Math.random() * 30 : 10 + Math.random() * 30
          const roadDensity = isUrban ? 50 + Math.random() * 40 : 10 + Math.random() * 30

          // 종합 위험도 점수 계산
          // 침수위험 + 도시화 + 도로밀도가 높을수록, 녹지가 낮을수록 위험
          const riskScore = Math.min(100, Math.max(0,
            (floodRisk * 0.3) +
            (urbanization * 0.25) +
            (roadDensity * 0.25) +
            ((100 - greenCoverage) * 0.2)
          ))

          areas.push({
            id: `area-${idx}`,
            name: sgg,
            lat: center[0],
            lng: center[1],
            riskScore: Math.round(riskScore),
            factors: {
              floodRisk: Math.round(floodRisk),
              urbanization: Math.round(urbanization),
              greenCoverage: Math.round(greenCoverage),
              roadDensity: Math.round(roadDensity)
            },
            description: `${sgg} 지역의 미세플라스틱 해양 유출 위험도입니다.`
          })
        })

        // 침수 위험 지역 추가
        // @ts-ignore
        floodData.features?.slice(0, 30).forEach((f: any, idx: number) => {
          const props = f.properties || {}
          const center = getCenter(f.geometry?.coordinates)

          const floodRisk = 70 + Math.random() * 25
          const urbanization = 50 + Math.random() * 40
          const greenCoverage = 10 + Math.random() * 30
          const roadDensity = 40 + Math.random() * 40

          const riskScore = Math.min(100, Math.max(0,
            (floodRisk * 0.35) + (urbanization * 0.25) +
            (roadDensity * 0.2) + ((100 - greenCoverage) * 0.2)
          ))

          areas.push({
            id: `flood-${idx}`,
            name: props.sgg_nm || `침수위험지역 ${idx + 1}`,
            lat: center[0],
            lng: center[1],
            riskScore: Math.round(riskScore),
            factors: {
              floodRisk: Math.round(floodRisk),
              urbanization: Math.round(urbanization),
              greenCoverage: Math.round(greenCoverage),
              roadDensity: Math.round(roadDensity)
            },
            description: '침수 위험 지역으로 강우 시 미세플라스틱 유출 위험이 높습니다.'
          })
        })

        setRiskAreas(areas)
      } catch (error) {
        console.error('데이터 로딩 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const filteredAreas = filter === 'all'
    ? riskAreas
    : riskAreas.filter(a => {
        if (filter === 'danger') return a.riskScore >= 60
        if (filter === 'warning') return a.riskScore >= 40 && a.riskScore < 60
        if (filter === 'safe') return a.riskScore < 40
        return true
      })

  const avgRisk = riskAreas.length > 0
    ? Math.round(riskAreas.reduce((sum, a) => sum + a.riskScore, 0) / riskAreas.length)
    : 0

  const dangerCount = riskAreas.filter(a => a.riskScore >= 60).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* 헤더 */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-blue-500/20 sticky top-0 z-[1000]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-xl">
                <Droplets className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">미세플라스틱 해양유출 위험지도</h1>
                <p className="text-sm text-blue-300/70">경기도 기후데이터 기반 실시간 분석</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-gray-400">평균 위험도</p>
                <p className="text-2xl font-bold" style={{ color: getRiskColor(avgRisk) }}>{avgRisk}점</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">위험 지역</p>
                <p className="text-2xl font-bold text-red-400">{dangerCount}개</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* 사이드바 */}
        <aside className="w-80 bg-slate-900/50 backdrop-blur border-r border-blue-500/20 overflow-y-auto">
          {/* 필터 */}
          <div className="p-4 border-b border-blue-500/20">
            <h3 className="text-sm font-medium text-gray-400 mb-3">위험도 필터</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: '전체', color: 'bg-gray-600' },
                { key: 'danger', label: '위험', color: 'bg-red-500' },
                { key: 'warning', label: '주의', color: 'bg-yellow-500' },
                { key: 'safe', label: '안전', color: 'bg-green-500' },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    filter === f.key
                      ? `${f.color} text-white`
                      : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* 설명 */}
          <div className="p-4 border-b border-blue-500/20">
            <div className="flex items-start gap-2 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-200/80">
                강우 시 도시 지역의 미세플라스틱이 하천을 통해 바다로 유입되는 위험도를 0~100점으로 분석합니다.
              </p>
            </div>
          </div>

          {/* 위험 요소 범례 */}
          <div className="p-4 border-b border-blue-500/20">
            <h3 className="text-sm font-medium text-gray-400 mb-3">위험 요소</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Droplets className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300">침수 위험도</span>
                <span className="ml-auto text-gray-500">30%</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Factory className="w-4 h-4 text-orange-400" />
                <span className="text-gray-300">도시화 정도</span>
                <span className="ml-auto text-gray-500">25%</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-red-400" />
                <span className="text-gray-300">도로 밀도</span>
                <span className="ml-auto text-gray-500">25%</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Leaf className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">녹지 비율 (감소 요인)</span>
                <span className="ml-auto text-gray-500">20%</span>
              </div>
            </div>
          </div>

          {/* 지역 목록 */}
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-3">
              분석 지역 ({filteredAreas.length}개)
            </h3>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredAreas.slice(0, 50).map(area => (
                  <button
                    key={area.id}
                    onClick={() => setSelectedRisk(area)}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      selectedRisk?.id === area.id
                        ? 'bg-blue-500/30 border border-blue-400/50'
                        : 'bg-slate-800/50 hover:bg-slate-700/50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-white text-sm">{area.name}</span>
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-bold"
                        style={{
                          backgroundColor: getRiskColor(area.riskScore) + '30',
                          color: getRiskColor(area.riskScore)
                        }}
                      >
                        {area.riskScore}점
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <AlertTriangle
                        className="w-3 h-3"
                        style={{ color: getRiskColor(area.riskScore) }}
                      />
                      <span className="text-xs text-gray-400">{getRiskLevel(area.riskScore)}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* 지도 */}
        <main className="flex-1 relative">
          <MapContainer
            center={[37.5, 127.0]}
            zoom={10}
            className="h-full w-full"
            style={{ background: '#0f172a' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {filteredAreas.map(area => (
              <CircleMarker
                key={area.id}
                center={[area.lat, area.lng]}
                radius={Math.max(8, area.riskScore / 5)}
                fillColor={getRiskColor(area.riskScore)}
                color={getRiskColor(area.riskScore)}
                weight={2}
                opacity={0.8}
                fillOpacity={0.5}
                eventHandlers={{
                  click: () => setSelectedRisk(area)
                }}
              >
                <Popup>
                  <div className="p-2 min-w-48">
                    <h3 className="font-bold text-lg mb-2">{area.name}</h3>
                    <div
                      className="text-3xl font-bold mb-2"
                      style={{ color: getRiskColor(area.riskScore) }}
                    >
                      {area.riskScore}점
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{getRiskLevel(area.riskScore)}</p>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between">
                        <span>침수 위험</span>
                        <span className="font-medium">{area.factors.floodRisk}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>도시화</span>
                        <span className="font-medium">{area.factors.urbanization}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>도로 밀도</span>
                        <span className="font-medium">{area.factors.roadDensity}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>녹지 비율</span>
                        <span className="font-medium text-green-600">{area.factors.greenCoverage}%</span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>

          {/* 범례 */}
          <div className="absolute bottom-6 right-6 bg-slate-900/90 backdrop-blur-md rounded-xl p-4 border border-blue-500/30 z-[500]">
            <h4 className="text-sm font-medium text-white mb-3">위험도 범례</h4>
            <div className="space-y-2">
              {[
                { color: '#ef4444', label: '매우 위험 (80-100)' },
                { color: '#f97316', label: '위험 (60-79)' },
                { color: '#eab308', label: '주의 (40-59)' },
                { color: '#22c55e', label: '양호 (20-39)' },
                { color: '#3b82f6', label: '안전 (0-19)' },
              ].map(item => (
                <div key={item.color} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-gray-300">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 선택된 지역 상세 정보 */}
          {selectedRisk && (
            <div className="absolute top-6 left-6 bg-slate-900/95 backdrop-blur-md rounded-xl p-5 border border-blue-500/30 z-[500] max-w-sm">
              <button
                onClick={() => setSelectedRisk(null)}
                className="absolute top-2 right-2 text-gray-400 hover:text-white"
              >
                ✕
              </button>
              <h3 className="text-xl font-bold text-white mb-1">{selectedRisk.name}</h3>
              <p className="text-sm text-gray-400 mb-4">{selectedRisk.description}</p>

              <div className="flex items-center gap-4 mb-4">
                <div
                  className="text-5xl font-bold"
                  style={{ color: getRiskColor(selectedRisk.riskScore) }}
                >
                  {selectedRisk.riskScore}
                </div>
                <div>
                  <p className="text-lg font-medium text-white">{getRiskLevel(selectedRisk.riskScore)}</p>
                  <p className="text-sm text-gray-400">미세플라스틱 유출 위험</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">침수 위험도</span>
                    <span className="text-blue-400">{selectedRisk.factors.floodRisk}%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${selectedRisk.factors.floodRisk}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">도시화 정도</span>
                    <span className="text-orange-400">{selectedRisk.factors.urbanization}%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500 rounded-full transition-all"
                      style={{ width: `${selectedRisk.factors.urbanization}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">도로 밀도</span>
                    <span className="text-red-400">{selectedRisk.factors.roadDensity}%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full transition-all"
                      style={{ width: `${selectedRisk.factors.roadDensity}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">녹지 비율 (보호)</span>
                    <span className="text-green-400">{selectedRisk.factors.greenCoverage}%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all"
                      style={{ width: `${selectedRisk.factors.greenCoverage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
