
/**namespace:Cluster.ClusterPendingTasks */
interface pending_task {
	insert_order: integer;
	priority: string;
	source: string;
	time_in_queue_millis: integer;
	time_in_queue: string;
}