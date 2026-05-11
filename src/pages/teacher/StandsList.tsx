import React, { useState } from 'react';
import { useFeria } from '../../store/FeriaContext';
import { QrCode, Printer, MapPin, CheckCircle } from 'lucide-react';
import { 
  LuminousPanel, 
  LuminousTable, 
  LuminousTableHeader, 
  LuminousTableBody, 
  LuminousTableRow, 
  LuminousTableHead, 
  LuminousTableCell, 
  StatusChip, 
  LuminousSearchBar, 
  LuminousActionButton,
  StatusType
} from '../../components/ui/luminous';

export default function StandsList() {
  const { stands } = useFeria();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' | null }>({
    key: '',
    direction: null,
  });

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' | null = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null;
    }
    setSortConfig({ key, direction });
  };

  const filteredStands = React.useMemo(() => {
    let items = stands.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.group.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.zone.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig.key && sortConfig.direction) {
      items = [...items].sort((a, b) => {
        const aValue = a[sortConfig.key as keyof typeof a];
        const bValue = b[sortConfig.key as keyof typeof b];

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return items;
  }, [stands, searchTerm, sortConfig]);

  const getStatusTypeAndLabel = (status: string): { type: StatusType, label: string } => {
    switch (status) {
      case 'active': return { type: 'success', label: 'Disponible' };
      case 'recommended': return { type: 'info', label: 'Recomendado' };
      case 'saturated': return { type: 'danger', label: 'Lleno' };
      case 'moderate': return { type: 'warning', label: 'Moderado' };
      default: return { type: 'neutral', label: 'Cerrado' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-luminous-text-primary">Gestión de Stands</h1>
          <p className="text-luminous-text-secondary">Administra los proyectos y exporta códigos QR.</p>
        </div>
        
        <LuminousSearchBar 
          placeholder="Buscar stand, grupo, zona..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <LuminousTable>
        <LuminousTableHeader>
          <LuminousTableRow>
            <LuminousTableHead 
              sortDirection={sortConfig.key === 'name' ? sortConfig.direction : null}
              onSort={() => handleSort('name')}
            >
              Nombre / Grupo
            </LuminousTableHead>
            <LuminousTableHead 
              sortDirection={sortConfig.key === 'zone' ? sortConfig.direction : null}
              onSort={() => handleSort('zone')}
            >
              Ubicación
            </LuminousTableHead>
            <LuminousTableHead 
              sortDirection={sortConfig.key === 'status' ? sortConfig.direction : null}
              onSort={() => handleSort('status')}
            >
              Estado
            </LuminousTableHead>
            <LuminousTableHead 
              sortDirection={sortConfig.key === 'totalVisitors' ? sortConfig.direction : null}
              onSort={() => handleSort('totalVisitors')}
            >
              Visitas
            </LuminousTableHead>
            <LuminousTableHead className="text-right">Acciones</LuminousTableHead>
          </LuminousTableRow>
        </LuminousTableHeader>
        <LuminousTableBody>
          {filteredStands.map(stand => {
            const { type, label } = getStatusTypeAndLabel(stand.status);
            return (
              <LuminousTableRow key={stand.id}>
                <LuminousTableCell>
                  <p className="font-bold text-luminous-text-primary line-clamp-1">{stand.name}</p>
                  <p className="text-luminous-cyan/80 text-xs mt-0.5">Grupo {stand.group} • {stand.tema}</p>
                </LuminousTableCell>
                <LuminousTableCell>
                  <div className="flex items-center text-luminous-text-primary font-medium">
                    <MapPin className="w-4 h-4 mr-1.5 text-luminous-cyan" />
                    {stand.zone}
                  </div>
                </LuminousTableCell>
                <LuminousTableCell>
                  <StatusChip status={type} label={label} />
                </LuminousTableCell>
                <LuminousTableCell>
                  <div className="flex flex-col">
                    <span className="font-bold text-luminous-text-primary">{stand.totalVisitors} totales</span>
                    <span className="text-xs text-luminous-text-secondary">{stand.currentVisitors} ahora</span>
                  </div>
                </LuminousTableCell>
                <LuminousTableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <LuminousActionButton variant="secondary" size="sm" title="Imprimir QR" onClick={() => alert('Simulando impresión de QR para ' + stand.name)}>
                      <Printer className="w-4 h-4 sm:mr-2" />
                      <span className="hidden sm:inline">Imprimir QR</span>
                    </LuminousActionButton>
                  </div>
                </LuminousTableCell>
              </LuminousTableRow>
            );
          })}
          {filteredStands.length === 0 && (
            <LuminousTableRow>
              <LuminousTableCell colSpan={5} className="py-12 text-center text-luminous-text-secondary">
                  No se encontraron stands que coincidan con la búsqueda.
              </LuminousTableCell>
            </LuminousTableRow>
          )}
        </LuminousTableBody>
      </LuminousTable>
    </div>
  );
}
