import { memo, useEffect, useMemo, useState } from 'react';
import PuzzleCard, { getPuzzleType } from './PuzzleCard';
import { Puzzle } from '../../data/puzzle';
import { Serializer } from '../../data/serializer/allSerializers';
import { Compressor } from '../../data/serializer/compressor/allCompressors';

const serialized: string[] = [
  'dfl_bczNCsIwEATgV5E5B7StvSz0IOILVCXgRWy76mKNJU2IYn13qaD4N9dvZkbrK5y4mkGQwX7jeNAG5kbMDgo7KxUI6XncLVIKIRQhaK1N0IU2RZ9uGlE3P4rhx4ytOmeRumSRMv5YsM0i-sT4HWP6XcZPHH9h8o7pH3zdJl3uTcW2rD1XCgqVbLdS-tpdQIlCLeYAAhQ23u1PFoThZLXMZ32V29JK4-Rk-srtDg%3D%3D',
  'dfl_bZDBasMwEET_Zc97sN00DgIdSq89NQEdQ2UrragyLoqEIur-e5ECcUMz7B7mzSwCNftvCjY4Q4K20fspYjQjMb17O5Kgtjm3zbxrGwEAqQjQZbVG0kpppKR0QrHQQAKgoRWqVHX_VGNV5yadn1sxb50JwXg-y46z7Phi5ZO48p6z7BeOeNSVt7V_sbJrlqD_G2wWvuYsV9eDhT9wlo93eHlgc4evbvj8Wj7RDy6akYlptIeDHaILmcSayVl8kiBieovhY_Ik6CWfLEypmtPg7VewE0rl5xc%3D',
  'dfl_lYzBasNADER_pSiQ00Jj04JRyKEb-gN2iqAXs107jvCiNVsFEuL8e3DdNtdWIN7MMMyqvoCyhhYQqoF7lu5Bk-MABrrEDSAUp2LcFSi_R0IT7PQkdzMrIXsv_kgrNG4zHKux_HBSD061TWK-uclP-XKR5U_rXb5cPBdra62dg232FcymmlGijyKt19qFYHwMMW0al3r8yzQR0f-mA3cHBQMN7_fsj0HPgNnKQGDpAQEMuKMeYgKEx5f3t_J16rafPvGgHGWqXG8%3D',
  'dfl_TY_dbsMgDIXfxZW6G4QWtEobVS8gLzC1vY8gpQ0tg4wQpduyd5_46VrLwubz8UE8Nz8QdDAKKLwrG9yHtu5pAAQnrw9AoSLXisz7ilCZYpJymiaZMh4y9fdIXOLISmblTZgz6crCJLPlv--DV_Er29P9DSnlXFeEYswY5xgzjjFmmGPGMOMs9RGVOYu8kDIp47SQa2x4LCWyJb7JkiA5Y15nhlnNeZ1g7Bmbd_O2ddaqNjTCGNQ64_zmIPyFenXSzjbCK1Gw0acuoEF_q82KSmGbXoSgvEWlbsiVLBcVeVnvyXKxel3Hv2dQVwnkyy6XLR2t_hxVM3SiV49vAIKDPh51O5rwBfQNgdH2AhQAgRhD5zxQ6IQx7iyGXvmoV0PrdR-0s1H3-wc%3D',
  'dfl_NcoxC8IwFATg_3JzCLoIzfhcdVHhRmlr1Ie1LemTKNb_LhG86e74Fsc3TK2LCNjWlvQJh0vSEwKqZzUfqkARiogXIUv3v02hJ8lM0lMoOYv8HmlywUXkxtP_wyyNkN7P62WY9_OuHe5jFy0ex9ospt7B4aTns7aPzl4IK4dO-xsC4FA_7DokBGxek_ax0Di1SUfToS_k8wU%3D',
  'dfl_rZFBbsIwEEWvUn0kVqPKhpiAkRdV1AsEuukGmWCK1dQg1xGJmt69gkASpCw7m5l5-nqLGbb5QbAhN5BIDtq6J290FuzRgfDh7Q4SnJWc1WvO5LO7VTv8V3XmOuGyXrnia2s8lSqmSi2oWdVUtjzq83nHGVUqvvPZI5_cedRxTpViA56LfzrA475HdHzRz0eP-VnrqdOtdpuTDsF4R7euRCnGIz6JlmsxHon5cvBC57NzTSrh11SzrJqWgrCz-73NijxUkIKQW_cJCRB0EQ5HD4mX97f09ZI035m3p-ubJfD7Bw%3D%3D',
  'dfl_nVFRa8JADP4rJYJPR7db1zFOfLCyP1Adhb2U6_XUwyNXrtFW1v330VZEYTC3hCQk38eXQB7zTyBDVoOAzBDquja4DfRR-1Nw1J50Cwy23pQggEctj7o1j0R4bQleLAlDzC4ehsMwG_JPCP4D-U0tubmtW3LRrbpUOUStKJfWMuWs8_NS-r0oJOaVJNIe2bnO4zaeTvjT82wdTyfx6-ysW_RRFFebRtaSD6yxWY0l_YNw00fT4H3CwKA0m41RB0snEC8MrME9CAAG8kA750HAw-LjPX3rqbpW3lRkHIKARVBJ2gXkbt_79Q0%3D',
  'dfl_7ZVNT4MwGMe_iqmJp6bhRXCp4VBAvXhS7wtsdTbWskCXjTi_uykMN3lpe9jBgyQ8Dfx_z3sCzvwTSCY5BRjcVRUVkmWc1xdvdJetCpHxCx9AsCrZEmDgBzvf27_4AUYICcNlhSgbx9MW2SB6_RDEhJylnTPVcqa5_O9oFPnf0d_f0T7xQ_WRISSOdTeyY-I4SdJ0-kZ2DCFpaq7GyKhMumzIkjlXPabeCbFltLtQDVkyulyqIVM9B0bXe5qa53NgdLsgxLyvjjHkakdow2h6b4doy0zuosMsmenOO8zMaHrvMN18TpipXXSYbl8ds3_mVEpawl3koADWUYgC2L6KCP7RPLcRnVEx7DvGR831GtGdjareTT9sMhCbCEPV9_uu6cDVux5Vm2J-13SHe2PwnVExHHg-DEo6zXo_mMRp4Pt-4FPxYf9U1R95wav5mpbzkq5YIeCi2AgZOXBR8KKMlln5jvNMzNeZ8hHwcEbhzru6dL3r25fw6jKY3W63eb7dtrYVErcR2ofn9niaiBX2YqmfV2tFnh-tOCqaHACCJXt9ZYsNlzXAMwg4E-8AAwBBtpFvRQkweKwrJqhCabUo2VqyQijk6xs%3D',
  'dfl_1ZbPj6IwFMf_laYmHAyZiCJrIB6Aceaws5fVDccJv9RmsLilLJp1__dNXxEK4lw2HrYm9L1vqX39vFdg8v4bc8KzFNt4vSdbTugOPYc0TrGOd4wk2MaGdbIuG8OyAy8IgiiqqqqCixd4gVfJJuQgCLxAmtAC0aqquaPrK-P1jItvWPaTaK7rea4LHfjC8zzo_nX8sr58P5QFifU4p5zl2RuhabGMJ9rImJpONDVr6yg79mvyZFF_ro1M0wHbM1vbVexXxX5R7JWpcxbGH0sBUv7pxrC00XzhAEeFaAS_lmitN0S77Y6sDMnV_Hq1R6OVq61lJyEDBRW0NrIMR8CeLRwF-NU7tiZrAAulgTzqCS99YdXzn3u-P5K5gZxAOIZ1-tKuC7kRjsjPDddH5-saha9E8ei89cfbKNatec1njbKbUyEqeb3NbS-_3RyLw3VV1UPW19wB7XVAexnQVgOaUhl1MdT7mJ_MbpwbJcL5wqEDrTvBNzoTuoPrrquSvUt3gHBD2ZgOqMcB7Rb3PeT3sH-CXkFYB2vHZcHzg56kRczIkZOcLsdf0zOK9yHdpfBMGiM3yxDNeVqgkKWoEC-hNEEhRenPMsxQeMhLynXxLlrORF4gH7P6gRZFonbFVWu4A2_gLNd_J3FO4cif4LhPwD6DPQVbCRBUF43l1DESc1FxPkR5BreKOLROjaj18WltqHXR1ET_lMEiMmDLcL4lLmN59eNYhSyBIZbzsIlzApsd3uVU2aXxv-8SJmEdJ2S7JXGZ8TO2TR1nhH5gG2MdhyXf5wzb-O1cECo-XpTdilv-_AU%3D',
  'dfl_7VfbbuIwEP2VyJF4QFGVK4sS8ZAb1UrtSgu89KlKglssQlzlUkDL_vvKdkqMgVCKVtuucFV5ZjzHZ0axZ4z6-AuUqEwhsMEIvcJcGqZ4WUgezGBUzqQHXAEFPOdoCmxg6CvN2EwM3V7WI46XB0cc764c82sf-6j37SN6XcJ-DvYw4vx9PjZ4no1v6Lbruq7ntf23r17xfxe_GW9Gi6pAiZLgrMxxeocyWAwStSNruunEeq-WXjQ256_qTS8bymZHNk2HKiEnB5zs806e0cguJ9_KnDLklZCTA4PfllM8ndtWV8o8SuYDQ1_pFgt3Yugd2eo7Rw_sifN8cjkWPPk5bgwx_dufjyB3uN9_bfegZ-9w0Yi5ZI-5XIv1ScS_KNbstvj1bblpGaRutK2TqnLFX4Zvq9q-73ntVd_3P3vX-ep4dlvGbGL9k7Yhvod25J7mkD5q9B2ul75ppJ--yaynhj1m2fY8QfdlweBZu7or6LeyYBiKhlDQA0ukFAyeKVCaIoNgCAU9MEUGwUDeCTsMhpiUIVIKhlDQA0OkFAzkDbFDyd4U9C1Bv6KdVEWJF8oUFkmOXkqEs0E3QAXxIEpBi2ZX-v6c4RxKVZbDKJlFcQqlDJewUMhvl4G-0us3SVNk67KrUUN9qhjZI0pwRuNY0RhUKq85mYuGWl2py6BdiWClYr2IcUpdCT_1sVZmc-wm9ce1-k52YDSOvrZ1bIzjRhxREhZwT3Pupz8rWJC47qN8TtdyXEbbQFWa7eE0NS5N7f9NU_1Kad6T-vYDl_Djn_LTn9j2HCkEKGCKnp5QUqXlGtjfFJCibA5sABQQVeUM58AGd-sCZZC4NrkSl99_AA%3D%3D',
];

const curatedPuzzles: { link: string; puzzle: Puzzle }[] = [];

export interface CuratedPuzzlesProps {
  filter?: string;
}

// eslint-disable-next-line react/prop-types
export default memo(function CuratedPuzzles({ filter }: CuratedPuzzlesProps) {
  filter = filter ?? 'All';
  const [puzzles, setPuzzles] = useState<typeof curatedPuzzles>(curatedPuzzles);
  useEffect(() => {
    void (async () => {
      while (serialized.length > 0) {
        const data = serialized.pop();
        if (!data) break;
        const decompresed = await Compressor.decompress(
          decodeURIComponent(data)
        );
        const puzzle = Serializer.parsePuzzle(decompresed);
        curatedPuzzles.push({ puzzle, link: data });
        setPuzzles([
          ...curatedPuzzles.sort(
            (a, b) => a.puzzle.difficulty - b.puzzle.difficulty
          ),
        ]);
      }
    })();
  }, []);
  const filteredPuzzles = useMemo(() => {
    return puzzles.filter(({ puzzle }) =>
      filter === 'All' ? true : getPuzzleType(puzzle.grid) === filter
    );
  }, [puzzles, filter]);
  return filteredPuzzles.map(({ puzzle, link }) => (
    <PuzzleCard
      className="min-w-64 transition-all hover:scale-105 hover:rotate-3 hover:shadow-xl"
      key={puzzle.title}
      grid={puzzle.grid}
      metadata={puzzle}
      link={'/solve?d=' + link}
    />
  ));
});
