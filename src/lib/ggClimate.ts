/**
 * 경기기후 플랫폼 API 헬퍼
 * https://climate.gg.go.kr/ols/data/api
 *
 * 404개 레이어의 경기도 공간정보 데이터를 쉽게 조회
 */

// API 키 - 해커톤용 (본인 키로 교체 권장)
const API_KEY = "4c58df36-82b2-40b2-b360-6450cca44b1e";
const BASE_URL = "https://climate.gg.go.kr/ols/api/geoserver/wfs";

// ============================================
// 타입 정의
// ============================================

export interface GeoJSONFeature {
  type: "Feature";
  geometry: {
    type: string;
    coordinates: number[] | number[][] | number[][][];
  };
  properties: Record<string, unknown>;
}

export interface GeoJSONResponse {
  type: "FeatureCollection";
  totalFeatures: number;
  features: GeoJSONFeature[];
  numberMatched: number;
  numberReturned: number;
}

// 공원 데이터 타입
export interface ParkProperties {
  uid: string;
  sgg_nm: string; // 시군구명
  lclsf_nm: string; // 대분류명
  mclsf_nm: string; // 중분류명
  sclsf_nm: string; // 소분류명 (소공원, 어린이공원 등)
  biotop_area: number; // 면적(㎡)
}

// 문화재 데이터 타입
export interface CulturalPropertyProperties {
  alias: string; // 문화재 이름
  remark: string; // 문화재 코드
  col_adm_se: string; // 행정구역 코드
  st_area_sh: number; // 면적
  st_perimet: number; // 둘레
}

// ============================================
// 기본 API 호출 함수
// ============================================

/**
 * WFS API 기본 호출
 */
async function fetchWFS(
  typeName: string,
  maxFeatures: number = 100,
  additionalParams: Record<string, string> = {}
): Promise<GeoJSONResponse> {
  const params = new URLSearchParams({
    apiKey: API_KEY,
    service: "WFS",
    version: "1.1.0",
    request: "GetFeature",
    typeName,
    outputFormat: "application/json",
    maxFeatures: String(maxFeatures),
    ...additionalParams,
  });

  const response = await fetch(`${BASE_URL}?${params}`);

  if (!response.ok) {
    throw new Error(`API 호출 실패: ${response.status}`);
  }

  return response.json();
}

// ============================================
// 공원 데이터
// ============================================

/**
 * 공원 데이터 조회
 * @param maxFeatures 최대 조회 개수 (기본 100, 최대 1000)
 * @param 시군구 시군구명으로 필터 (예: "수원", "과천시")
 */
export async function getParks(
  maxFeatures: number = 100,
  시군구?: string
): Promise<GeoJSONResponse> {
  const data = await fetchWFS("park", maxFeatures);

  // 시군구 필터링 (클라이언트 사이드)
  if (시군구) {
    data.features = data.features.filter((f) =>
      (f.properties.sgg_nm as string)?.includes(시군구)
    );
    data.numberReturned = data.features.length;
  }

  return data;
}

/**
 * 공원 목록만 간단히 가져오기
 */
export async function getParkList(
  maxFeatures: number = 100
): Promise<
  Array<{
    id: string;
    시군구: string;
    분류: string;
    면적: number;
    좌표: number[];
  }>
> {
  const data = await getParks(maxFeatures);

  return data.features.map((f) => ({
    id: f.properties.uid as string,
    시군구: f.properties.sgg_nm as string,
    분류: f.properties.sclsf_nm as string,
    면적: f.properties.biotop_area as number,
    좌표: getCenterPoint(f.geometry.coordinates),
  }));
}

// ============================================
// 문화재 데이터
// ============================================

/**
 * 문화재 데이터 조회
 */
export async function getCulturalProperties(
  maxFeatures: number = 100
): Promise<GeoJSONResponse> {
  return fetchWFS("cultural_property", maxFeatures);
}

/**
 * 문화재 목록만 간단히 가져오기
 */
export async function getCulturalPropertyList(
  maxFeatures: number = 100
): Promise<Array<{ 이름: string; 면적: number; 좌표: number[] }>> {
  const data = await getCulturalProperties(maxFeatures);

  return data.features.map((f) => ({
    이름: f.properties.alias as string,
    면적: f.properties.st_area_sh as number,
    좌표: getCenterPoint(f.geometry.coordinates),
  }));
}

// ============================================
// 기타 레이어
// ============================================

/**
 * 국립공원 데이터
 */
export async function getNationalParks(
  maxFeatures: number = 100
): Promise<GeoJSONResponse> {
  return fetchWFS("national_park", maxFeatures);
}

/**
 * 녹지지역 데이터
 */
export async function getGreenAreas(
  maxFeatures: number = 100
): Promise<GeoJSONResponse> {
  return fetchWFS("green_area", maxFeatures);
}

/**
 * 도로 데이터
 */
export async function getRoads(
  maxFeatures: number = 100
): Promise<GeoJSONResponse> {
  return fetchWFS("road", maxFeatures);
}

/**
 * 비오톱 유형 평가 데이터
 */
export async function getBiotopTypes(
  maxFeatures: number = 100
): Promise<GeoJSONResponse> {
  return fetchWFS("biotop_type_evl_5grd", maxFeatures);
}

/**
 * 개발제한구역 데이터
 */
export async function getDevelopmentRestrictionZones(
  maxFeatures: number = 100
): Promise<GeoJSONResponse> {
  return fetchWFS("lsmd_cont_ud801_41", maxFeatures);
}

// ============================================
// 범용 레이어 조회
// ============================================

/**
 * 레이어명으로 직접 조회
 * @param layerName 레이어명 (예: "park", "cultural_property")
 */
export async function getLayer(
  layerName: string,
  maxFeatures: number = 100
): Promise<GeoJSONResponse> {
  return fetchWFS(layerName, maxFeatures);
}

/**
 * 사용 가능한 전체 레이어 목록 조회
 */
export async function getLayerList(): Promise<string[]> {
  const params = new URLSearchParams({
    apiKey: API_KEY,
    service: "WFS",
    version: "1.1.0",
    request: "GetCapabilities",
  });

  const response = await fetch(`${BASE_URL}?${params}`);
  const text = await response.text();

  // XML에서 레이어명 추출 (간단한 정규식)
  const matches = text.match(/<Name>([^<]+)<\/Name>/g) || [];
  return matches
    .map((m) => m.replace(/<\/?Name>/g, ""))
    .filter((name) => !name.includes(":") && name !== "WFS");
}

// ============================================
// 유틸리티
// ============================================

/**
 * 폴리곤 좌표에서 중심점 계산
 */
function getCenterPoint(coordinates: unknown): number[] {
  try {
    // Polygon의 첫 번째 링
    const ring = Array.isArray(coordinates[0]?.[0])
      ? (coordinates[0] as number[][])
      : (coordinates as number[][]);

    if (!ring || ring.length === 0) return [0, 0];

    const sum = ring.reduce(
      (acc, coord) => [acc[0] + coord[0], acc[1] + coord[1]],
      [0, 0]
    );

    return [sum[0] / ring.length, sum[1] / ring.length];
  } catch {
    return [0, 0];
  }
}

/**
 * EPSG:5186 → EPSG:4326 (WGS84) 좌표 변환
 * 주의: 정확한 변환은 proj4 라이브러리 사용 권장
 * 이건 대략적인 변환용
 */
export function convertToWGS84(x: number, y: number): [number, number] {
  // 간단한 근사 변환 (정확하지 않음, proj4 사용 권장)
  // 경기도 중심 기준 대략적 변환
  const lng = (x - 200000) / 88000 + 127;
  const lat = (y - 600000) / 111000 + 38;
  return [lng, lat];
}

// ============================================
// 사용 예시
// ============================================

/*
// 기본 사용
import { getParks, getCulturalProperties } from './lib/ggClimate'

// 공원 100개 가져오기
const parks = await getParks(100)
console.log(parks.features)

// 수원시 공원만
const suwonParks = await getParks(100, "수원")

// 문화재 목록
const 문화재목록 = await getCulturalPropertyList(50)

// 아무 레이어나 직접 조회
const 비오톱 = await getLayer("biotop_type_evl_5grd", 50)
*/
