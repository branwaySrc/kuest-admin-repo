
export type EnumSubwayLineCategory = 'Metro' | 'Regional' | 'LightRail';
export type EnumLocationCategory = 'food' | 'spot' | 'shopping' | 'culture';
export type EnumSubwayLines = 
  | 'line_1' | 'line_2' | 'line_3' | 'line_4' | 'line_5' 
  | 'line_6' | 'line_7' | 'line_8' | 'line_9'
  | 'line_suin_bundang' | 'line_shin_bundang' | 'line_gyeongui_jungang' 
  | 'line_airport' | 'line_gyeongchun' | 'line_gyeonggang' | 'line_seohae'
  | 'line_ui_sinseol' | 'line_sillim' | 'line_gimpo_gold';



export interface SubwayLine {
  id: string; //uuid
  name_kr: string;
  name_en: EnumSubwayLines;
  hex_color: string;
  display_order: number;
  line_category: EnumSubwayLineCategory;
}
  
// 3. 지하철역 정보 인터페이스 (subway_stations 테이블)
export interface SubwayStation {
  id: string; // UUID
  station_name_kr: string;
  station_name_en: string;
  line_ids: EnumSubwayLines[]; // ENUM 배열
  station_lat: number;
  station_lng: number;
  created_at: string;
  updated_at: string;
}

// 3. 메인 장소 정보 (locations 테이블)
export interface Location {
  id: string; // UUID
  title: string;
  category: EnumLocationCategory[];
  tags: string[]; //원하는거 
  
  // Display Config
  is_archived: boolean;
  is_home_hero: boolean;
  is_sponsored: boolean;
  is_vegan: boolean;
  weight: number;

  location_name:string;
  
  // Geography (지도 렌더링 필수)
  location_lat: number;
  location_lng: number;

  // Metadata
  location_address_kr: string | null;
  location_address_en: string | null;
  location_opening_hours: string | null;
  location_rating: number;
  location_thumbnail_url: string | null;
  location_memo: string | null;
  location_instagram: string | null;
  location_phone: string | null; // 누락된 연락처 추가
  location_images: string[];

  // JSONB Content
  location_content: {
    ko: string;
    en: string;
    summary_ko?: string; // 리스트 뷰를 위한 짧은 요약본
    summary_en?: string;
  };

  related_station : string[];
  related_line : string[];
  nearest_exit : string[];

  // Relations (API 응답 시 JOIN된 데이터 타입)
  // 장소와 역의 관계를 담는 테이블이 별도로 존재해야 함
  created_at: string;
  updated_at: string;
}