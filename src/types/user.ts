export type User = {
  id: number;
  agent_name: string;
  agent_phone: string;
  agent_avatar: string | null;
  agent_level_code: string;
  id_agent_level: number;
  id_agent_status: number;
  agent_status_name: string;
  is_has_child: boolean;
  image_notices: string;
  is_open: boolean;
  is_lock: boolean;
  bkav_data_pdf: boolean;
  ftp_web: string;
  domain: string;
  is_update_cccd: boolean;
  role: string | null;
  ability: Array<{
    action: string;
    subject: string;
  }>;
  token: string;
  [key: string]: any;
};
