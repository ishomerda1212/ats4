import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Applicant } from '../types/applicant';
import { StatusBadge } from '@/shared/components/common/StatusBadge';
import { formatDate } from '@/shared/utils/date';

interface ApplicantTableProps {
  applicants: Applicant[];
}

export function ApplicantTable({ applicants }: ApplicantTableProps) {
  return (
    <div className="rounded-lg border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>氏名</TableHead>
            <TableHead>学校</TableHead>
            <TableHead>学部・学科</TableHead>
            <TableHead>選考段階</TableHead>
            <TableHead>更新日</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applicants.map((applicant) => (
            <TableRow key={applicant.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{applicant.name}</div>
                  <div className="text-sm text-muted-foreground">{applicant.nameKana}</div>
                </div>
              </TableCell>
              <TableCell>{applicant.schoolName}</TableCell>
              <TableCell>
                <div>
                  <div>{applicant.faculty}</div>
                  <div className="text-sm text-muted-foreground">{applicant.department}</div>
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge stage={applicant.currentStage} />
              </TableCell>
              <TableCell>{formatDate(applicant.updatedAt)}</TableCell>
              <TableCell className="text-right">
                <Link to={`/applicants/${applicant.id}`}>
                  <Button size="sm" variant="outline">
                    詳細
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}