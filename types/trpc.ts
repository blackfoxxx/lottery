// This file should mirror the AppRouter type from the backend
// For now, we'll define the structure based on the routers we know exist

export type AppRouter = {
  banners: {
    list: {
      query: (input?: { is_active?: boolean }) => Promise<Array<{
        id: number;
        title: string;
        description?: string;
        image_url: string;
        link_url?: string;
        is_active: boolean;
        display_order: number;
        created_at: string;
        updated_at: string;
      }>>;
    };
    create: {
      mutate: (input: {
        title: string;
        description?: string;
        image_url: string;
        link_url?: string;
        is_active: boolean;
        display_order: number;
      }) => Promise<any>;
    };
    update: {
      mutate: (input: {
        id: number;
        title?: string;
        description?: string;
        image_url?: string;
        link_url?: string;
        is_active?: boolean;
        display_order?: number;
      }) => Promise<any>;
    };
    delete: {
      mutate: (input: { id: number }) => Promise<void>;
    };
    toggleActive: {
      mutate: (input: { id: number }) => Promise<any>;
    };
  };
  bundles: {
    list: {
      query: (input?: { is_active?: boolean }) => Promise<Array<{
        id: number;
        name: string;
        description?: string;
        discount_type: 'percentage' | 'fixed';
        discount_value: number;
        is_active: boolean;
        product_ids: number[];
        created_at: string;
        updated_at: string;
      }>>;
    };
    getById: {
      query: (input: { id: number }) => Promise<any>;
    };
    create: {
      mutate: (input: {
        name: string;
        description?: string;
        discount_type: 'percentage' | 'fixed';
        discount_value: number;
        is_active: boolean;
        product_ids: number[];
      }) => Promise<any>;
    };
    update: {
      mutate: (input: {
        id: number;
        name?: string;
        description?: string;
        discount_type?: 'percentage' | 'fixed';
        discount_value?: number;
        is_active?: boolean;
        product_ids?: number[];
      }) => Promise<any>;
    };
    delete: {
      mutate: (input: { id: number }) => Promise<void>;
    };
    toggleActive: {
      mutate: (input: { id: number }) => Promise<any>;
    };
  };
  reviews: {
    list: {
      query: (input?: {
        product_id?: number;
        status?: 'pending' | 'approved' | 'rejected';
      }) => Promise<Array<{
        id: number;
        product_id: number;
        user_id: number;
        rating: number;
        title?: string;
        comment?: string;
        status: 'pending' | 'approved' | 'rejected';
        helpful_count: number;
        created_at: string;
        updated_at: string;
      }>>;
    };
    byProduct: {
      query: (input: { product_id: number }) => Promise<any[]>;
    };
    create: {
      mutate: (input: {
        product_id: number;
        rating: number;
        title?: string;
        comment?: string;
      }) => Promise<any>;
    };
    approve: {
      mutate: (input: { id: number }) => Promise<any>;
    };
    reject: {
      mutate: (input: { id: number }) => Promise<any>;
    };
    delete: {
      mutate: (input: { id: number }) => Promise<void>;
    };
    bulkApprove: {
      mutate: (input: { ids: number[] }) => Promise<void>;
    };
    bulkReject: {
      mutate: (input: { ids: number[] }) => Promise<void>;
    };
  };
  bundleAnalytics: {
    overview: {
      query: (input?: {
        start_date?: string;
        end_date?: string;
      }) => Promise<{
        total_bundles: number;
        active_bundles: number;
        total_revenue: number;
      }>;
    };
    performance: {
      query: (input?: {
        start_date?: string;
        end_date?: string;
      }) => Promise<Array<{
        id: number;
        name: string;
        views: number;
        conversions: number;
        revenue: number;
        conversion_rate: number;
      }>>;
    };
    trackView: {
      mutate: (input: { bundle_id: number }) => Promise<void>;
    };
    trackConversion: {
      mutate: (input: { bundle_id: number; order_id: number }) => Promise<void>;
    };
  };
  health: {
    check: {
      query: () => Promise<{ status: string; timestamp: string }>;
    };
  };
};
