
/**namespace:Cluster.NodesStats */
interface memory_stats {
	heap_used: string;
	heap_used_in_bytes: long;
	heap_used_percent: long;
	heap_committed: string;
	heap_committed_in_bytes: long;
	heap_max: string;
	heap_max_in_bytes: long;
	non_heap_used: string;
	non_heap_used_in_bytes: long;
	non_heap_committed: string;
	non_heap_committed_in_bytes: long;
	/**custom_serialization */
	pools: map<string, j_v_m_pool>[];
}