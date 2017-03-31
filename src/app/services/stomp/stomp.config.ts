/**
 * Represents a configuration object for the
 * STOMPService to connect to, pub, and sub.
 */
export interface StompConfig {
  // Which server?
  host: string;
  port: number;
  path: string;
  ssl: boolean;

  // What credentials?
  user: string;
  pass: string;

  // How often to heartbeat?
  heartbeat_in?: number;
  heartbeat_out?: number;

  // Enable client debugging?
  debug: boolean;
}
