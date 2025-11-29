import { getLeadById } from "@/requests/entities";
import { Lead } from "@/types/entity";
import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";



export const LeadPage: FC = () => {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [lead, setLead] = useState<Lead | null>(null);

    useEffect(() => {
        const loadData = async () => {
            if (!id) return;

            setLoading(true);

            try {
                const lead = await getLeadById(id);
                setLead(lead);
            } catch (error) {
                console.error('Failed to load data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    return (
        <>
            
        </>
    );
}